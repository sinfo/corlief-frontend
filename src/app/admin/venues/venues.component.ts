import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';

import { VenuesService } from 'src/app/admin/venues/venues.service';
import { Venue } from './venue';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent implements OnInit {

  venue: Venue;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  constructor(private venuesService: VenuesService) { }

  ngOnInit() {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.venuesService.uploadVenue(this.currentFileUpload).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
          console.log(this.progress.percentage);
        } else if (event instanceof HttpResponse) {
          this.venue = <Venue>event.body;
          console.log(this.venue);
        }
      },
      error => {
        console.error(error);
      }
    );
    this.selectedFiles = undefined;
  }


}
