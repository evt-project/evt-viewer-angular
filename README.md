EVT 2.0 (evt-viewer-angular) [![Build Status](https://travis-ci.org/evt-project/evt-viewer-angular.svg?branch=master)](https://travis-ci.org/evt-project/evt-viewer-angular)
===============

1 - Introduction
--------------------

### 1.1 - About EVT

[EVT (Edition Visualization Technology)](http://evt.labcd.unipi.it/) is a light-weight, open source tool specifically designed to create digital editions from texts encoded according to the [TEI XML schemas and Guidelines](http://www.tei-c.org/Guidelines/P5/), freeing the scholars from the burden of web programming and enabling the final users to browse, explore and study digital editions by means of a user-friendly interface.

This tool was born in the context of the [Digital Vercelli Book](http://vbd.humnet.unipi.it/) project, in order to allow the creation of a digital edition (which has been available in beta form for more than two years) of the Vercelli Book, a parchment codex of the late tenth century, now preserved in the Archivio e Biblioteca Capitolare of Vercelli and regarded as one of the four most important manuscripts of the Anglo-Saxon period as it regards the transmission of poetic texts in the Old English language.
However it has evolved into a tool suitable to fit different texts and needs. For example, it is now being used to publish the digital edition of the [Codice Pelavicino manuscript](http://pelavicino.labcd.unipi.it), a medieval codex preserving charters dating back to the XIII century. The continuous development and need to adapt it to different types of documents and TEI-encoded texts has shifted the development focus towards the creation of a more general tool for the web publication of TEI-based digital editions, able to cater for multiple use cases.

The entire structure of the software has been remodeled, in order to make it lighter, more usable and more adaptable; we decided to use the Model View Controller (MVC) approach, that is a very common architectural pattern in object-oriented programming, that allows to separate the logical presentation of the data, from the application logic and the processing core.
Wanting to maintain the original feature of EVT, and therefore do not give up the client only approach, we decided to use [Angular](https://angular.io/), a JavaScript framework inspired by the MVC programming logic, especially suitable for the development of client-side Web applications; among other things, this framework allows to define custom HTML components and use the data-binding mechanism to associate the model of the data to the UI elements, and manage the updates of the latter avoiding the direct DOM manipulation.

### 1.2 - How it works
Before the refactoring, EVT was composed of two main units: EVT Builder, for the transformation of the encoded text using special XSLT 2.0 templates, and EVT Viewer, for the visualization into a browser of the results of the transformations and the interaction with them. The idea under the new version of EVT is instead to leave to EVT Viewer the task of reading and parsing with JavaScript functions the encoded text, and “save” as much as possible within a data model, that persists in the client main memory, and is organized in a way that allows a very quick access to the data in case of need. This has obviously led to the elimination of the EVT Builder level, and therefore it allows to open a digital edition directly in the browser without any previous XSLT transformation.

### 1.3 - Main features
At the present moment, EVT is being moved from AngularJS to Angular 2+.
For a complete list of features, please refer to the [AngularJS version] (https://github.com/evt-project/evt-viewer)

2 - A short guide to EVT
--------------------------------
If you are interested in **using** EVT 2 to prepare an edition right away, you should probably download the ready-to-use release package that can be downloaded from [SourceForge](https://sourceforge.net/projects/evt-project/). See the *Installation and use* section first, then *Configuration*, to understand how EVT works and how you can use it to publish your editions. A more detailed guide will be published separately, as a reference manual, and will also include instructions about customization.

If, on the other hand, you are interested in **developing** a specific functionality in EVT 2, or in modifying an existing one, or preparing your edition with the most recent (yet stable) version of EVT, you should download the [*GitHub Development framework*](https://github.com/evt-project/evt-viewer). See the *Development framework installation and use* section to know how to install and configure the environment needed for this purpose. If you intend to change the source code for personal needs, please **fork** the project. If you want to contribute to the main project (by fixing a bug or adding a feature), please ask for a **pull request** and/or contact us at evt.developers@gmail.com.

### 2.1 - Installation and use
Work in progress... stay in touch!

### 2.2 - Configuration
Work in progress... stay in touch!


3 - Development framework installation and use
--------------------------------

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.3.

### 3.1 - Requirements
For development, you will only need Node.js installed on your environement. And please use the appropriate Editorconfig plugin for your Editor (not mandatory).

### 3.2 - Node
[Node](http://nodejs.org/) is really easy to install & now include [NPM](https://npmjs.org/).
You should be able to run the following command after the installation procedure
below.

    $ node --version
    v10.15.3

    $ npm --version
    6.4.1

#### Node installation on OS X
You will need to use a Terminal. On OS X, you can find the default terminal in
`/Applications/Utilities/Terminal.app`.

Please install [Homebrew](http://brew.sh/) if it's not already done with the following command.

    $ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"

If everything when fine, you should run

    brew install node

#### Node installation on Linux
    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs

#### Node installation on Windows
Just go on [official Node.js website](http://nodejs.org/) & grab the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it.


### 3.3 - Install 
    $ git clone https://gitlab.com/dipi.chiara/evt-viewer-angular.git
    $ cd evt-viewer-angular
    $ npm install


### 3.4 - Start & watch with development server
    $ npm run start

oppure

    $ ng serve

If nothing happens, then open your browser and navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.

With the second instruction you can choose the port where to run the application (es `ng serve --port=4202`, thenn connecto to `http://localhost:4202/`).

### 3.5 - Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### 3.6 - Simple build for production
    $ npm run build

oppure

    $ ng build

The build artifacts will be stored in the `dist/` directory.
With the second instruction you can use the `--prod` flag for a production build.

### 3.7 - Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### 3.8 - Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### 3.9 - Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

4 - EVT Manual
---------------------

Work in progress... stay in touch!


5 - Feedback
-----------------
User feedback is very much appreciated: please send all comments, suggestions, bug reports, etc. to evt.developers@gmail.com.