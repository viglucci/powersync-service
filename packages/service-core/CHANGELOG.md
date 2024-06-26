# @powersync/service-core

## 0.2.2

### Patch Changes

- 8245912: Fix teardown command not terminating after some errors.
- 7587a74: Fix date parsing in replication for dates further back than 100 AD.
- Updated dependencies [7587a74]
  - @powersync/service-jpgwire@0.17.13

## 0.2.1

### Patch Changes

- 4a57787:
  - Use a LRU cache for checksum computations, improving performance and reducing MongoDB database load.
  - Return zero checksums to the client instead of omitting, to help with debugging sync issues.

## 0.2.0

### Minor Changes

- 526a41a: Added support for user parameters when making a StreamingSyncRequest.

## 0.1.3

### Patch Changes

- 5f5163f: Fix performance issues and improve logging for initial snapshot replication.
- Updated dependencies [5f5163f]
  - @powersync/service-jpgwire@0.17.12

## 0.1.2

### Patch Changes

- b5f4ebf: Fix missing authentication errors for websocket sync stream requests
- Updated dependencies [b5f4ebf]
  - @powersync/service-rsocket-router@0.0.7

## 0.1.1

### Patch Changes

- 006fb8d: Updated `lru-cache` dependency minimum version to prevent downstream consumers of package using broken version.

## 0.1.0

### Minor Changes

- 3d9feb2: Added the ability to capture anonymous usage metrics

### Patch Changes

- Updated dependencies [3d9feb2]
  - @powersync/service-types@0.1.0
  - @powersync/service-jpgwire@0.17.11

## 0.0.2

### Patch Changes

- 285f368: Initial public release
- Updated dependencies [285f368]
  - @powersync/service-rsocket-router@0.0.6
  - @powersync/service-sync-rules@0.17.10
  - @powersync/service-jpgwire@0.17.10
  - @powersync/service-jsonbig@0.17.10
  - @powersync/service-types@0.0.2
