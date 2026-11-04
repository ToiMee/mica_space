# Security

## Reporting

Open an issue at https://github.com/ToiMee or contact the repository owner privately for sensitive reports.

## Threat model

Mica Space is a local plugin. It assumes the DSH host and the local workspace are trusted.

- The plugin does not include an API key.
- Model credentials belong to DSH.
- The local HTTP routes are served by DSH; do not expose them on an untrusted network.
- Workspace data is stored as plain JSON under `.chat-space`.
- Attachments are stored by DSH and are not encrypted by this plugin.

## Known limitations

- Attachment cleanup is limited by the DSH attachment API.
- Uploaded files are extracted into text before being sent to the configured model provider.
- Git backup may push conversation data to a remote you configure.
- Schema migration keeps `.pre-schema-v2.bak`; remove it manually if you do not want the old snapshot retained.
