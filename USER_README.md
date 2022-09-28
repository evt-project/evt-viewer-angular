EVT 3.0
===============


1 - Introduction
--------------------

### 1.1 - About EVT

[EVT (Edition Visualization Technology)](http://evt.labcd.unipi.it/) is a light-weight, open source tool specifically designed to create digital editions from texts encoded according to the [TEI XML schemas and Guidelines](http://www.tei-c.org/Guidelines/P5/), freeing the scholars from the burden of web programming and enabling the final users to browse, explore and study digital editions by means of a user-friendly interface.

This tool was born in the context of the [Digital Vercelli Book](http://vbd.humnet.unipi.it/) project, in order to allow the creation of a digital edition (which has been available in beta form for more than two years) of the Vercelli Book, a parchment codex of the late tenth century, now preserved in the Archivio e Biblioteca Capitolare of Vercelli and regarded as one of the four most important manuscripts of the Anglo-Saxon period as it regards the transmission of poetic texts in the Old English language.
However it has evolved into a tool suitable to fit different texts and needs. For example, it is now being used to publish the digital edition of the [Codice Pelavicino manuscript](http://pelavicino.labcd.unipi.it), a medieval codex preserving charters dating back to the XIII century. The continuous development and need to adapt it to different types of documents and TEI-encoded texts has shifted the development focus towards the creation of a more general tool for the web publication of TEI-based digital editions, able to cater for multiple use cases.

The entire structure of the software has been remodeled, in order to make it lighter, more usable and more adaptable; we decided to use the Model View Controller (MVC) approach, which is a very common architectural pattern in object-oriented programming since it allows to separate the logical presentation of the data from the application logic and the processing core.
Wanting to maintain the original feature set of EVT, and therefore do not give up the client only approach, we decided to use [Angular](https://angular.io/), a JavaScript framework inspired by the MVC programming logic, especially suitable for the development of client-side Web applications; among other things, this framework allows to define custom HTML components and use the data-binding mechanism to associate the model of the data to the UI elements, and manage the updates of the latter avoiding the direct DOM manipulation.

### 1.2 - How it works
Before the refactoring, EVT was composed of two main units: EVT Builder, for the transformation of the encoded text using special XSLT 2.0 templates, and EVT Viewer, for the visualization of the transformation results in a browser and for the user interaction with them. The idea under the new version of EVT is instead to leave to EVT Viewer the task of reading and parsing the encoded text by means of JavaScript functions, and “save” as much as possible within a data model, that persists in the client main memory, and is organized in a way that allows a very quick access to the data in case of need. This has obviously led to the elimination of the EVT Builder phase, and therefore it allows to open a digital edition directly in the browser without any previous XSLT transformation.

### 1.2 - Main features
At the present moment, EVT is getting near to a first alpha release.
For a complete list of features, please refer to the [AngularJS version](https://github.com/evt-project/evt-viewer), but also keep in mind that several new features are envisioned for the first stable release (see [_There and back again: what to expect in the next EVT version_](http://amsacta.unibo.it/6848/).
In order to stay updated on the progress of current EVT 3 developments, you can refer to the [`CHANGELOG.md`](https://github.com/evt-project/evt-viewer-angular/blob/develop/CHANGELOG.md) file on the develop branch. As soon as a first alpha version is published, the version in the master branch will correspond to the features integrated in the released package.

2 - Using EVT
--------------------

### 2.1 - Preparing an edition with EVT
If you are interested in **using** EVT 3 to prepare an edition right away, you should probably download the ready-to-use release package. See the [Installation and use](https://github.com/evt-project/evt-viewer-angular/wiki/Installation-and-use) section first, then [Configuration](https://github.com/evt-project/evt-viewer-angular/wiki/Configuration) to understand how EVT works and how you can use it to publish your editions.

### 2.2 - Contributing and request features or bugfixes

If, on the other hand, you are interested in contributing to the main project, by fixing a bug or adding/modifying a feature, please refer mainly to the [Development](https://github.com/evt-project/evt-viewer-angular/wiki/Development) section to know how things work and to learn more about our development workflow. Note that some technical details are sometimes given in other sections, too.

If you intend to change the source code for personal needs, please **fork** the project and/or contact us at [evt.developers@gmail.com](mailto:evt.developers@gmail.com). If you want to implement a new feature, or improve an existing one, best results are achieved when there is a dialogue with the developers, especially to avoid duplication of efforts and/or to keep the customized code in sync with general development.

3 - Installation and use
--------------------

EVT 3 can be used to prepare an edition right away, immediately after downloading the release package on your hard drive: see the *​Installation and management of the edition data* section first, then *Configuration*​, to understand how EVT works and how you can use it to publish your editions. 

### 3.1 - Installation and management of the edition data
Installation is quite simple, in fact it is not an actual installation in the traditional sense: you just need to download the compressed archive from the release page (or the EVT home page), unzip it in a suitable location on your hard drive, and you are ready to use it with your edition files. Within the main folder there are only two folders which should be modified by the user:
* `assets/config`​: here you will find four different configuration files which can be used to properly configure EVT as needed (see the [Configuration](https://github.com/evt-project/evt-viewer-angular/wiki/Configuration) section for further details;
* `assets/data`​: here you will put all of your edition data, including the TEI-encoded documents, images, and other edition files.

Everything else should not be modified, unless you know what you are doing very well. It is in fact possible to modify the JavaScript parsers, but doing so directly in an EVT release is very difficult, because everything is minified and uglified for performance reasons, and also less efficient than doing it on the development version. Since EVT is an open source tool, you are welcome to fork it, change the existing parsers and/or add your own parsers and eventually open a Pull Request so that your changes will be integrated in the main version of EVT.

Before moving to the configuration, you should have the different edition components ready. As you will see during configuration, the paths to the resources are completely configurable, thus there is no strict obligation to follow the default structure to organize your files; however we would like to suggest and recommend the default structure to you as a specific way to organize your files, one which will allow you to keep the different contents well separated from each other.

In the `assets/data` folder you can create one folder for each type of data (images, text, etc.). For example:
* `data/text` => put your textual data here, possibly further organized in subfolders such as `documents`, `schema`, `sources`, `witnesses`, etc.
* `data/images` => put your images here, you will find some sub-folders (e.g. data/images/single​, ​data/images/hotspot etc.), create more if needed
* `data/models` => put your 3D models here, again you will find the `​multires` and `singleres`​ subfolders.
* `data/viscoll` => put all VisColl-related files here.

To have your edition parsed and loaded in the browser by EVT you have to point to it explicitly modifying the file_config.json file in the ​config directory and specifying the name of the main file: `"dataUrls": ["data/text/My_edition.xml"]`.
While this is the most important configuration option, since it tells EVT where to start with your edition, note that there are several other options available in that file, so that you can customize the layout and appearance of your edition (see the (Configuration)[https://github.com/evt-project/evt-viewer-angular/wiki/Configuration] section). Also note that some configuration options may be necessary to make desired features available, for instance to add a required edition level, so make sure you read the following section and check the default configuration file.

### 3.2 - Open your edition
In order to locally access your edition (for test/study purposes, before publishing it on a web server) you need to enable local files access in your browser. In fact, browsers such as Chrome, Firefox (since v. 67), Safari, etc., have adopted a security-conscious policy that forbids loading local files (= documents available on the user’s computer drive) in the browser as a result of the execution of JavaScript programs. The goal is to improve global security when browsing the Web, but the unpleasant collateral effect is that of preventing the loading of digital editions based on EVT, or similar software, from local folders. 

Fortunately there are several workarounds that can be used to test EVT editions that are located on your hard drive:
* option no. 1: close every window of Chrome and launch it from the command line with the `--allow-file-access-from-files` parameter​; then open the ​`index.html` file;
  * Windows
  ```
  cd C:\Program Files (x86)\Google\Chrome\Application
  chrome.exe --allow-file-access-from-files
  ```
  * Linux
  ```
  google-chrome --allow-file-access-from-files
  ```
  * MacOSX
  ```
  open -a "Google Chrome" --args --allow-file-access-from-files
  ```
* option no. 2: download and install Firefox ESR v. 60: this version predates the new security policy adopted in FF v. 67 and, furthermore, it can be installed in parallel with any other version of Firefox;
* option no. 3: install an extension providing a local web server on Firefox or Chrome, f.i. there is ​[this one](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb)​ available for Chrome.
* option no. 4: use http-server, a simple, zero-configuration command-line static HTTP server that can be downloaded from npm and brew registry (see https://github.com/http-party/http-server and note that you need NodeJs or Brew to be installed first).

Note again that this problem, however, only affects local testing: after the edition has been uploaded on a server there are no problems in accessing it with any of the major browsers.

4 - Editing Configuration
--------------------

There are several configuration options, ranging from setting the folders where edition data is stored to choosing the User Interface layout and the tools to be made available for the final user, that can be set by editing the configuration files in the `assets/config` directory.

To facilitate the configuration work, configuration options are divided into three macro groups:

* Edition Configuration (`edition_config.json`), where to set the configurations closely related to the digital edition, such as the title, the edition level(s), etc. [See details here](https://github.com/evt-project/evt-viewer-angular/wiki/Edition-Configuration).

* File Configuration (`file_config.json`), where to set the path(s) to the file(s) of the digital edition. [See details here](https://github.com/evt-project/evt-viewer-angular/wiki/File-Configuration).

* UI Configuration (`ui_config.json`), where to set the configuration closely related to the UI, such as the default language, the default/available theme(s), etc. [See details here](https://github.com/evt-project/evt-viewer-angular/wiki/Ui-Configuration).

It is also possible to configurate the style of editorial phenomena (e.g. addition, deletion, etc), in order to override the EVT default layouts. This particular configuration should be defined in the file `editorial_conventions_config.json`. [See details here](https://github.com/evt-project/evt-viewer-angular/wiki/Editorial-Conventions-Configuration)

5 - Style customization
--------------------

You can add your own CSS instructions to modify the appearance of specific TEI elements by editing the `config-style.css` file in the config directory. The customization of generic and linear TEI element is very simple, even if EVT does not yet consider them in the default visualization: in fact, the TEI elements which are not handled in any particular way by EVT are always transformed in HTML elements with the TEI tag name as class name. In this way, the customization is very easy: just add a rule that match the tag name of the TEI element to style. F.i., a deletion encoded with `del` element, can be displayed with a line through the text just by adding the rule `.del { text-decoration: line-through; }`. If you wish to have different layouts for different edition levels, we suggest to try and use editorial conventions configuration as indicated above.

6 - EVT Manual
--------------------

Work in progress... stay in touch!

7 - Feedback
--------------------

User feedback is very much appreciated: please send all comments, suggestions, bug reports, etc. to evt.developers@gmail.com.

