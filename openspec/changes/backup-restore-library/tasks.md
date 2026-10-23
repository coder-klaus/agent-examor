## 1. API core

- [x] 1.1 Add `backup-restore` service (validate payload, filter export, restore with ID remap)
- [x] 1.2 Wire `GET /export/backup` query params and `POST /import/library-restore`

## 2. MCP

- [x] 2.1 Extend `export_backup` args; add `import_library_restore`

## 3. Admin

- [x] 3.1 Add **备份** tab (export download + import form)

## 4. Verification

- [x] 4.1 Extend smoke or manual path; run `make check`
