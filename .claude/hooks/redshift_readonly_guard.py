#!/usr/bin/env python3
import json, re, sys

ALLOWED = re.compile(r"^\s*(SELECT|WITH|EXPLAIN|SHOW|DESCRIBE|DESC|VALUES)\b", re.I | re.S)
DANGER  = re.compile(r"\b(INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|CREATE|COPY|UNLOAD|"
                     r"GRANT|REVOKE|VACUUM|ANALYZE|MERGE|CALL|RENAME|REINDEX|CLUSTER|LOCK|"
                     r"ATTACH|DETACH|RESET|SET\s+SESSION\s+AUTHORIZATION)\b", re.I)

def block(msg):
    print(f"[redshift hook] BLOCKED: {msg}", file=sys.stderr)
    sys.exit(2)

try:
    payload = json.load(sys.stdin)
except Exception:
    sys.exit(0)

if not payload.get("tool_name", "").startswith("mcp__redshift"):
    sys.exit(0)

sql = ""
for k in ("sql", "query", "statement", "text"):
    v = (payload.get("tool_input") or {}).get(k)
    if isinstance(v, str) and v.strip():
        sql = v; break
if not sql:
    sys.exit(0)

# 剥离注释，防止藏在 /* */ 或 -- 里绕过
sql = re.sub(r"/\*.*?\*/", " ", sql, flags=re.S)
sql = re.sub(r"--[^\n]*", " ", sql)

if not ALLOWED.match(sql):
    block(f"必须以 SELECT/WITH/EXPLAIN/SHOW 起手")
m = DANGER.search(sql)
if m:
    block(f"包含被禁关键字：{m.group(0).upper()}")
if len([p for p in sql.split(";") if p.strip()]) > 1:
    block("禁止多语句")
sys.exit(0)
