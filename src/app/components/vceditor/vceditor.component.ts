import { Component, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-vceditor',
    templateUrl: './vceditor.component.html',
    styleUrls: ['./vceditor.component.scss']
  })

  export class VceditorComponent implements OnInit {
    sampleTerm:term = {
      "params": {
          "title": "Omelia I",
          "taxonomy": "Texts",
          "description": "",
          "show": true
      },
      "objects": {
          "Group": [],
          "Leaf": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9
          ],
          "Recto": [
              2,
              4,
              6,
              10
          ],
          "Verso": [
              3
          ]
      }};
  
    sampleFolio = {foliodata: {"params": {
      "page_number": "",
      "texture": "",
      "image": {
          "manifestID": "",
          "label": "",
          "url": ""
        },
        "script_direction": "None"
    },
    "parentOrder": 1},
    terms: []};
  
    sampleLeaf:vceleaf = {leafdata: {
      "params": {
          "folio_number": "1",
          "material": "None",
          "type": "Original",
          "attached_above": "None",
          "attached_below": "None",
          "stub": "No",
          "nestLevel": 1
      },
      "conjoined_leaf_order": 10,
      "parentOrder": 1,
      "rectoOrder": 1,
      "versoOrder": 1},
    memberrecto: this.sampleFolio,
    memberverso: this.sampleFolio,
    terms: []};
  
    sampleQuire:vcequire = {quiredata: {
      "params": {
        "type": "Quire",
        "title": "Default",
        "nestLevel": 1
    },
    "tacketed": [],
    "sewing": [],
    "parentOrder": null,
    "memberOrders": [
        "Leaf_1",
        "Leaf_2",
        "Leaf_3",
        "Leaf_4",
        "Leaf_5",
        "Leaf_6",
        "Leaf_7",
        "Leaf_8",
        "Leaf_9",
        "Leaf_10"
    ]
    },
    memberleaves: [this.sampleLeaf],
    quireImg:"",
    terms: []};


    leafs : Array<vceleaf> = [];
    quires : Array<vcequire> = [];
    rectos : Array<vcefolio> = [];
    versos: Array<vcefolio> = [];
    terms: Array<term> = [];
    Data: any;
    
    constructor(private http: HttpClient) { }
    
    takeData() {
      let observable = this.http.get('./assets/data/visColl.json');
      observable.subscribe({next: (data:any)=> {
      this.Data=data;
      }
    });
      observable.subscribe(() => this.assignmentcycle());
    }
    
    assignmentcycle() {
      for (let rectocounter in this.Data.Rectos) {
        let folio=JSON.parse(JSON.stringify(this.sampleFolio));
        folio.foliodata=JSON.parse(JSON.stringify(this.Data.Rectos[rectocounter]));
        this.rectos.push(folio);
      }

      for (let versocounter in this.Data.Versos) {
        let folio=JSON.parse(JSON.stringify(this.sampleFolio));
        folio.foliodata=JSON.parse(JSON.stringify(this.Data.Versos[versocounter]));
        this.versos.push(folio);
      }

      for (let leafcounter in this.Data.Leafs) {
        let leaf=JSON.parse(JSON.stringify(this.sampleLeaf));
        leaf.leafdata=JSON.parse(JSON.stringify(this.Data.Leafs[leafcounter]));
        leaf.memberrecto=this.rectos.filter(recto => (recto.foliodata.parentOrder == Number(leafcounter)));
        leaf.memberverso=this.versos.filter(verso => (verso.foliodata.parentOrder == Number(leafcounter)));
        this.leafs.push(leaf);
      }
       
      for (let groupcounter in this.Data.Groups) {
        let group=JSON.parse(JSON.stringify(this.sampleQuire));
        group.quiredata=JSON.parse(JSON.stringify(this.Data.Groups[groupcounter]));
        group.memberleaves=this.leafs.filter(leaf => (leaf.leafdata.parentOrder == Number(groupcounter)));
        group.quireImg="./assets/data/SVG/"+this.Data.project.shelfmark.replace(/\s/g, "")+"-"+groupcounter.toString()+".svg";
        this.quires.push(group);
      }
    
      for (let termcounter in this.Data.Terms) {
        let term=JSON.parse(JSON.stringify(this.sampleTerm));
        term=JSON.parse(JSON.stringify(this.Data.Terms[termcounter]));
        this.terms.push(term);

        for (let quirenumber in term.objects.Group) {
          this.quires[Number(term.objects.Group[quirenumber])-1].terms.push(term);
        };


        for (let leafnumber in term.objects.Leaf) {
          this.leafs[Number(term.objects.Leaf[leafnumber])-1].terms.push(term);
        };
      
      
        for (let rectonumber in term.objects.Recto) {
          this.rectos[Number(term.objects.Recto[rectonumber])-1].terms.push(term);
        };

        for (let versonumber in term.objects.Verso) {
        this.versos[Number(term.objects.Verso[versonumber])-1].terms.push(term);
        };
      }
    }
    
    @Output() vceditorEvent = new EventEmitter();
    ngOnInit () {
      this.takeData();
    }
  }

  export class vcefolio {
    foliodata:foliodataType;
    terms:Array<term>;
    constructor(){}
  }

  export class vcequire {
    quiredata:quiredataType;
    memberleaves:Array<vceleaf>;
    quireImg:string;
    terms:Array<term>;
    constructor(){}
  }
  export class vceleaf {
      leafdata:leafdataType;
      memberrecto:vcefolio;
      memberverso:vcefolio;
      terms:Array<term>;
      constructor(){}
  }
  export class term {
    params: termParamsType;
    objects: termObjectsType;
  }
  export interface quiredataType {
    params: quiredataParamsType;
    tacketed: Array<string>;
    sewing: Array<string>;
    parentOrder: number;
    memberOrders:Array<string>;
  }
  export interface quiredataParamsType {
    type: string;
    title: string;
    nestLevel: number;
  }
  export interface leafdataType {
    params: leafdataParamsType;
    conjoined_leaf_order: number;
    parentOrder: number;
    rectoOrder: number;
    versoOrder: number
  }
  export interface leafdataParamsType{
    folio_number: number|string;
    material: string|boolean;
    type: string;
    attached_above: string|boolean;
    attached_below: string|boolean;
    stub: string|boolean;
    nestLevel: number;
  }
  export interface foliodataType {
    params: foliodataParamsType;
    parentOrder: number;
  }
  export interface foliodataParamsType{
    page_number: string;
    texture: string;
    image: imageType;
    script_direction: string;
  }
  export interface imageType{
    manifestID: string;
    label: string;
    url: string;
  }
  export interface termParamsType {
    title: string;
    taxonomy: string;
    description: string;
    show: boolean;
  }
  export interface termObjectsType {
    Group: Array<number>;
    Leaf: Array<number>;
    Recto: Array<number>;
    Verso: Array<number>;
  }
