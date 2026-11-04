# Privacy

Mica Space is a local DSH plugin. It does not include telemetry and does not ship an author API key.

## Data location

Space data is stored in:

```text
.chat-space/library.json
.chat-space/spaces/<id>.json
.chat-space/trash/
```

Attachments are stored by the DSH attachment service.

## Network access

- Lightweight memory and local co-occurrence memory do not use the network.
- When you ask a question, the question, current context, attachments, and extracted file text are sent to the model provider configured in DSH.
- Git backup contacts a remote only when you configure a remote and click backup.
- The plugin does not send analytics.

## Backups

`.bak`, `.pre-schema-v2.bak`, `.before-restore`, exported JSON, and Git backups may contain conversation content. Treat them as private data.

## Removing data

Deleting a space removes it from the library and moves its JSON to the trash. Permanent deletion removes the trash record. Attachment files are managed by DSH and may outlive a deleted space because the attachment service does not expose a delete API.
