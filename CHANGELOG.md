# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0-beta] - 2026-09-23

### Added
- YAML-based configuration format (new unified config system)
- Integrated edition view
- Synoptic edition view (enhanced from previous beta)
- Front matter support (`<front>`)
- New themes and UI configuration options
- FR localization
- New method to ensure valid `xml:id` for all elements, even when missing in source XML
- App correction sequence feature
- Accessibility improvements across multiple components
- Column layout support (`<CB>`)
- Error UI for debugging XML parsing and structural issues

### Changed
- Updated editorial configuration examples to YAML format
- Improved parsing and rendering of page separators (`<pb>`), including nested cases and edge conditions
- Updated Depa2 module and integrated into develop
- Enhanced textflow rendering logic
- Improved image–text line highlight behaviour
- Moved `biblTab` into UI configuration settings
- Minor UI adjustments to source, note and analogues boxes
- General performance enhancements (structural separator highlight, rendering pipeline, error modal)

### Fixed
- Verse–prose selector behaviour
- Incorrect parsing of `<pb>` elements (issue #228 and follow-up fixes)
- Pagination parsing issues
- Text content leakage into previous page when `<pb>` is inside tag lists
- Lemma display issues in Depa2
- Named entities reference opening bug
- Explosive word elements rendering
- Lacuna end rendering
- Config issues on page separator selector
- Duplicate errors in Errors modal
- Single `listOrder` bug
- Multiple fixes in integrated/synoptic edition rendering
- Textflow rendering bug
- Structural separator highlight performance issues

### Dependency Updates
- Bump `js-yaml` (via dependabot)

## [1.0.0-beta] - 2024-10-07

### Added
- Image-only mode
- Image-image mode
- Text–Image Linking (ITL)
- App source analogues frame
- Authorial/documental mixed view
- Synoptic view
- Bibliographic visualization
- Prose/verse toggler
- Docs images support
- Additional Pelavicino example images
- Default values for Saba (configuration)

### Changed
- Updated sample document images
- Moved image folder under `data`
- Updated CodeQL configuration

### Fixed
- Fix for editorial conventions (#218)
- Fix missing space in verses display in diplomatic transcription (#200)
- Fix syntactic error in i18n configuration files (#240)
- Bugfix: no recompiling for custom CSS (#242)

### Dependency Updates
- Bump `decode-uri-component` from 0.2.0 → 0.2.2 (#206)
- Bump `http-cache-semantics` from 4.1.0 → 4.1.1 (#216)
- Bump `ua-parser-js` from 0.7.32 → 0.7.33 (#215)
- Bump `json5` from 2.2.1 → 2.2.3 (#214)
- Bump `word-wrap` from 1.2.3 → 1.2.5 (#221)

## [1.0.0-alpha] - 2024-02-20

### Dependency Updates
- Updated to Angular 13

### Added
- Text/images connection in page change
- Support for styleDefDecl as default style of renditional information
- Apparatus entry inline visualization
- Support for viewer information extracted from xml
- Tags declaration visualization
- Namespace declaration visualization
- Rendition declaration visualization
- Editorial declaration visualization
- Sampling declaration visualization
- Project description visualization
- Encoding description visualization
- Critical edition navigation
- Project Info modal
- Notes statement visualization
- Series statement visualization
- Extent visualization
- Edition statement visualization
- Publication statement visualization
- Resp statement visualization
- Title statement visualization
- Header section visualization
- File description visualization
- Navigation toolbar
- Manuscript description header button
- Manuscript description visualization
- Manuscript part visualization
- Manuscript fragment visualization
- Additional visualization
- History visualization
- Physical description visualization
- Manuscript contents visualization
- Manuscript identifier visualization
- Text selection for generate text annotations
- Revision description data extraction
- Profile description data extraction
- Encoding description data extraction
- File description data extraction
- Critical text pages division
- Xi:include support for edition text
- Manuscript description data extraction
- Deletion vizualization
- Verses group visualization
- Multiple line words normalization in interpretative and critical edition
- Word visualization
- Incurable corruptions visualization
- Verses/Prose toggler
- Addition vizualization
- Known and unknown gaps. Support for "char", "line" and "word" as unit
- Critical text visualization
- Surplus visualization
- Damage visualization
- Configuration for editorial conventions
- Supplied text visualization
- IndexedDB support for annotator
- Verses visualization
- Navigation by view, page and edition level
- Custom logo
- Text emendations
- Text normalizations
- Junicode font for medievalists
- Glyphs in text
- Char and glyphs in characters declaration
- Apparatus entries extraction
- Numbered pharagraphs
- Critical and comment notes
- Named entities and interesting elements selector
- Witness list extraction
- Named entities visualisation
- Named entities extraction
- OpenSeadragon component with support for manifest file
- Analogues and sources extraction and configuration
- Analogues and sources visualization

### Changed
- Routing params keys
- Parse logic
- Start using "changelog"
