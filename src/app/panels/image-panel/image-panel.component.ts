import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EVTModelService } from 'src/app/services/evt-model.service';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'evt-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
})
export class ImagePanelComponent implements OnInit  {
  manifest = AppConfig.evtSettings.files.manifestURL !== '' && !!AppConfig.evtSettings.files.manifestURL
    ? AppConfig.evtSettings.files.manifestURL
    : undefined;

  @Input() set msDescID(p: string) {
     this._msDescID = p;
   }

  get msDescID() { return this._msDescID; }

  get imageIndex() { return this._imageIndex; }

  constructor(
    public evtModelService: EVTModelService,
    public http: HttpClient,
    private cdref: ChangeDetectorRef,
  ) {
  }
  public value: number;
  public msDesc$ = this.evtModelService.msDesc$;
  public images = [];
  public currentImg: string;
  // tslint:disable-next-line: variable-name
  private _msDescID: string;
  // tslint:disable-next-line: variable-name
  private _imageIndex: number;
  public page = 0;
  private showSecondaryContent = false;

  isSecondaryContentOpened(): boolean {
    return this.showSecondaryContent;
  }

  toggleMsDescContent(){
    this.showSecondaryContent = true;
  }

  resetMsDesc(){
    this.showSecondaryContent = false;
  }

  toggleImg(event){
    this._imageIndex = this.images.indexOf(event);
  }

  eventHandler(event: number){
    this.page = event;
    this.currentImg = this.images[this.page].label;
    this.cdref.detectChanges();
  }

  ngOnInit() {
    // tslint:disable-next-line: no-any
    this.http.get(`${this.manifest}`).subscribe((item: any) => {
      item.sequences.forEach((value) => {
        this.images.push(...value.canvases);
      });
      this._imageIndex = 0;
      this.currentImg = this.images[this.page].label;
      this.cdref.detectChanges();

      return this.images;
    });
  }

}
