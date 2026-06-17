# Graph Report - ../PharmaTrack_Backend  (2026-06-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 537 nodes · 930 edges · 27 communities (15 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]

## God Nodes (most connected - your core abstractions)
1. `AdminService` - 32 edges
2. `RepositoryService` - 32 edges
3. `AdminController` - 30 edges
4. `DatabaseService` - 26 edges
5. `compilerOptions` - 22 edges
6. `EmbeddingService` - 16 edges
7. `NewsService` - 16 edges
8. `MedicationRepository` - 15 edges
9. `MedicationService` - 15 edges
10. `RepositoryService` - 14 edges

## Surprising Connections (you probably didn't know these)
- `EmbeddingService` --calls--> `OpenAI SDK`  [EXTRACTED]
  src/common/embedding/embedding.service.ts → plan.md
- `MedicationRepository` --calls--> `EmbeddingService`  [EXTRACTED]
  src/medication/medication-repository.service.ts → src/common/embedding/embedding.service.ts
- `MedicationService` --calls--> `MedicationRepository`  [INFERRED]
  src/medication/medication.service.ts → src/medication/medication-repository.service.ts
- `MedicationModule` --references--> `EmbeddingService`  [EXTRACTED]
  src/medication/medication.module.ts → src/common/embedding/embedding.service.ts
- `MedicationController` --calls--> `MedicationService`  [EXTRACTED]
  src/medication/medication.controller.ts → src/medication/medication.service.ts

## Import Cycles
- None detected.

## Communities (27 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (11): AuthenticationController, AuthenticationModule, AuthenticationService, EmailService, LocalStrategy, LoginDto, RegisterDto, NotificationsService (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (17): AdminModule, CloudinaryController, CloudinaryModule, CloudinaryService, DatabaseModule, EmbeddingService, MedicationModule, CSRF_EXEMPT_PATHS (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (13): NewsController, NewsModule, HEALTH_CATEGORY_KEYWORDS, HEALTH_TEXT_KEYWORDS, NewsDataArticle, NewsDataResponse, NewsProviderService, NewsService (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (13): CreateUserInput, RepositoryService, SessionSerializer, CitiesController, CitiesModule, CitiesService, DatabaseService, ActiveIngredientType (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (18): SearchDto, PharmaciesController, PharmaciesModule, getAvailabilityTimeZone(), getLocalAvailabilityClock(), LocalAvailabilityClock, PharmaciesRepository, WEEKDAY_NAMES (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (41): author, dependencies, bcrypt, class-transformer, class-validator, cloudinary, crypto, express-mysql-session (+33 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (29): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (4): MedicationDto, MedicationController, MedicationRepository, MedicationService

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.16
Nodes (4): CreateDutyDto, CreatePharmacyDto, UpdateMedicationDto, UpdateWorkingHoursDto

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (4): CreateNotificationDto, SessionGuard, NotificationsController, ParsePositiveIntPipe

### Community 14 - "Community 14"
Cohesion: 0.21
Nodes (3): Roles(), UpdateInventoryDto, RolesGuard

### Community 15 - "Community 15"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 16 - "Community 16"
Cohesion: 0.24
Nodes (9): GlobalExceptionFilter, ALLOWED_HOSTS, bootstrap(), config, isDevelopmentOrigin(), isLocalOrigin(), isPrivateNetworkHost(), isPrivateNetworkOrigin() (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

## Knowledge Gaps
- **120 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DatabaseService` connect `Community 3` to `Community 0`, `Community 1`, `Community 2`, `Community 4`, `Community 9`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `RepositoryService` connect `Community 11` to `Community 0`, `Community 1`, `Community 9`, `Community 14`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 25`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `AdminService` connect `Community 12` to `Community 0`, `Community 1`, `Community 9`, `Community 10`, `Community 14`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 25`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0632996632996633 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06588235294117648 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07653061224489796 - nodes in this community are weakly interconnected._