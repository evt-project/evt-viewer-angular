import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ViewerDataType } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
})
export class ImagePanelComponent {
  @Input() viewerData: ViewerDataType;

  get imageIndex() { return this._imageIndex; }

  constructor(
    public evtModelService: EVTModelService,
    public http: HttpClient,
    private cdref: ChangeDetectorRef,
  ) {
  }
  public msDesc$ = this.evtModelService.msDesc$;
  public showSecondaryContent = false;
  public selectedPage;
  public msDescID = '';
  public value: number;
  public images = [];
  public currentImg: string;
  // tslint:disable-next-line: variable-name
  private _imageIndex: number;
  public manifest;
  public imagePath;
  public filename;

  toggleImg(event){
    this._imageIndex = this.images.indexOf(event);
  }

  eventPageImg(pageImg: number){
    if (this.viewerData?.type === 'manifest'){
      this.currentImg = this.images[pageImg - 1].label;
    }
    if (this.viewerData?.type === 'default'){
      this.currentImg = this.images[pageImg - 1].url.split('/').pop().split('.')[0];
    }
    this.cdref.detectChanges();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges() {
    if (this.viewerData?.type === 'manifest'){
      this.manifest = this.viewerData.value?.manifestURL;
      // tslint:disable-next-line: no-any
      this.http.get(`${this.manifest}`).subscribe((item: any) => {
        item.sequences.forEach((value) => {
          this.images.push(...value.canvases);
        });
        this.currentImg = this.images[0].label;
      });
    }
    if (this.viewerData?.type === 'default'){
      this.images = this.viewerData?.value?.xmlImages;
      this.imagePath =  this.viewerData?.value?.xmlImages[0]?.url;
      this.filename = this.imagePath.split('/').pop().split('.')[0];
      this.currentImg = this.filename;
    }
    else {
      this.currentImg = 'Error loading';
    }
  }

  isSecondaryContentOpened(): boolean {
    return this.showSecondaryContent;
  }

  isMsDescOpen(event: boolean){
    this.showSecondaryContent = event;
  }

  setMsDescID(idMsDesc: string){
    this.msDescID = idMsDesc;
  }

}
