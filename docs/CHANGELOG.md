# Changelog

## Version 1.6.0 (2026-04-17)

### Added
- Frontend repository integration with shared docs
- Demonstration of multi-repo subtree synchronization
- Cross-repository documentation updates

## Version 1.5.0 (2026-04-17)

### Added
- User search endpoint (GET /api/users/search)
- Support for general search query (q parameter)
- Support for specific name and email filters
- Combined search filters capability

## Version 1.4.0 (2026-04-17)

### Added
- Pagination support for GET /api/users endpoint
- Query parameters: page, limit  
- Pagination metadata in responses
- Support for up to 100 users per page

## Version 1.3.0 (2026-04-17)

### Added
- Batch user operations (POST /api/users/batch)
- Batch user deletion (DELETE /api/users/batch)
- Support for creating/deleting multiple users in single requests

## Version 1.2.0 (2026-04-17)

### Added
- New system status endpoint (GET /api/status)  
- Detailed health monitoring

## Version 1.1.0 (2026-04-17)

### Added
- New user creation endpoint (POST /api/users)
- User deletion endpoint (DELETE /api/users/:id)
- Enhanced API documentation

### Fixed
- Improved error handling for user operations
