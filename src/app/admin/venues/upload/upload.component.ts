import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { UploadService } from 'src/app/admin/venues/upload/upload.service';
import { LoginService } from 'src/app/admin/login/login.service';

import { Venue } from '../venue/venue';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  error: {
    type: String,
    message: String
  };
  closeResult: string;
  venue: Venue;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  constructor(
    private uploadService: UploadService,
    private modalService: NgbModal,
    private loginService: LoginService
  ) { }

  ngOnInit() {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.upload(this.currentFileUpload).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.venue = <Venue>JSON.parse(<string>event.body);
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.error = {
            type: 'fatal',
            message: 'Could not upload. Authentication failed. Please try to login.'
          };
        } else {
          this.error = {
            type: 'unknown',
            message: 'Upload failed.'
          };
        }
      }
    );
    this.selectedFiles = undefined;
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  close(reason: string) {
    this.modalService.dismissAll(reason);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
