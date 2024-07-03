import { Component, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-vceditor',
    templateUrl: './vceditor.component.html',
    styleUrls: ['./vceditor.component.scss']
  })

  export class VceditorComponent implements OnInit {
    sampleTerm:Term = {
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
  
    sampleSide:Vceside = {sidedata: {"params": {
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
  
    sampleLeaf:Vceleaf = {leafdata: {
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
    memberrecto: this.sampleSide,
    memberverso: this.sampleSide,
    terms: []};
  
    sampleQuire:Vcequire = {quiredata: {
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


    leaves : Array<Vceleaf> = [];
    quires : Array<Vcequire> = [];
    rectos : Array<Vceside> = [];
    versos: Array<Vceside> = [];
    terms: Array<Term> = [];
    Data: any;
    
    constructor(
      private http: HttpClient
      ) {

      }
    
    takeData() {
      let observable = this.http.get('./assets/data/visColl.json');
      observable.subscribe({next: (data:any)=> {
      this.Data=data;
      this.assignmentcycle();
    }});
    }
    
    assignmentcycle() {

      for (let rectocounter in this.Data.Rectos) {
        let side=JSON.parse(JSON.stringify(this.sampleSide)); //without double encoding, this would modify sampleSide
        side.sidedata=JSON.parse(JSON.stringify(this.Data.Rectos[rectocounter]));
        this.rectos.push(side);
      }

      for (let versocounter in this.Data.Versos) {
        let side=JSON.parse(JSON.stringify(this.sampleSide));
        side.sidedata=JSON.parse(JSON.stringify(this.Data.Versos[versocounter]));
        this.versos.push(side);
      }

      for (let leafcounter in this.Data.Leafs) {
        let leaf=JSON.parse(JSON.stringify(this.sampleLeaf));
        leaf.leafdata=JSON.parse(JSON.stringify(this.Data.Leafs[leafcounter]));
        leaf.memberrecto=this.rectos.find(recto => (recto.sidedata.parentOrder == Number(leafcounter))); //find for the first matching element; filter would return an array
        leaf.memberverso=this.versos.find(verso => (verso.sidedata.parentOrder == Number(leafcounter)));
        this.leaves.push(leaf);
      }

      for (let groupcounter in this.Data.Groups) {
        let group=JSON.parse(JSON.stringify(this.sampleQuire));
        group.quiredata=JSON.parse(JSON.stringify(this.Data.Groups[groupcounter]));
        group.memberleaves=this.leaves.filter(leaf => (leaf.leafdata.parentOrder == Number(groupcounter)));
        group.quireImg="./assets/data/SVG/"+this.Data.project.shelfmark.replace(/\s/g, "")+"-"+groupcounter.toString()+".svg";
        this.quires.push(group);
      }
    
      for (let termcounter in this.Data.Terms) {
        let term=JSON.parse(JSON.stringify(this.sampleTerm));
        term=this.Data.Terms[termcounter];
        this.terms.push(term);

        for (let quirenumber in term.objects.Group) {
          this.quires[Number(term.objects.Group[quirenumber])-1].terms.push(term);
        };

        for (let leafnumber in term.objects.Leaf) {
          this.leaves[Number(term.objects.Leaf[leafnumber])-1].terms.push(term);
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

  export class Vceside {
    sidedata:SidedataType;
    terms:Array<Term>;
  }

  export class Vcequire {
    quiredata:QuiredataType;
    memberleaves:Array<Vceleaf>;
    quireImg:string;
    terms:Array<Term>;
  }
  export class Vceleaf {
      leafdata:LeafdataType;
      memberrecto:Vceside;
      memberverso:Vceside;
      terms:Array<Term>;
  }
  export class Term {
    params: TermParamsType;
    objects: TermObjectsType;
  }
  export interface QuiredataType {
    params: QuiredataParamsType;
    tacketed: Array<string>;
    sewing: Array<string>;
    parentOrder: number;
    memberOrders:Array<string>;
  }
  export interface QuiredataParamsType {
    type: string;
    title: string;
    nestLevel: number;
  }
  export interface LeafdataType {
    params: LeafdataParamsType;
    conjoined_leaf_order: number;
    parentOrder: number;
    rectoOrder: number;
    versoOrder: number
  }
  export interface LeafdataParamsType{
    folio_number: number|string;
    material: string|boolean;
    type: string;
    attached_above: string|boolean;
    attached_below: string|boolean;
    stub: string|boolean;
    nestLevel: number;
  }
  export interface SidedataType {
    params: SidedataParamsType;
    parentOrder: number;
  }
  export interface SidedataParamsType{
    page_number: string;
    texture: string;
    image: ImageType;
    script_direction: string;
  }
  export interface ImageType{
    manifestID: string;
    label: string;
    url: string;
  }
  export interface TermParamsType {
    title: string;
    taxonomy: string;
    description: string;
    show: boolean;
  }
  export interface TermObjectsType {
    Group: Array<number>;
    Leaf: Array<number>;
    Recto: Array<number>;
    Verso: Array<number>;
  }
