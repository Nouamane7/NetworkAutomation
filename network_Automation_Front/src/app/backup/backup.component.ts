import { Component } from '@angular/core';
// import { createTextFile } from '../shared/backup';
import { BackupService } from '../shared/backup.service';
import * as JSZip from 'jszip';
@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css']
})
export class BackupComponent {
  generating:boolean = false;
  generated:boolean = false;
  files:Blob[] = []
  zip = new JSZip();
  hostnames: string = '';
  hostnameList: string[] = [];
  generatedZip: Blob | null = null;
  constructor(private backupServ: BackupService){}

  generateFile() {
    this.hostnameList = this.hostnames.split(',');
    const now = new Date();
    const year = now.getFullYear().toString().slice(2); // Get the last two digits of the year
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}_${month}_${day}-${hours}:${minutes}:${seconds}`;
    this.generating = true;
    this.backupServ.generateFile(this.hostnameList).subscribe((data:any) => {
      console.log(data);
      data.forEach((file:any) => {
        this.zip.file(`${file['hostname']}_${formattedDate}.txt`, file['file']);
    });
    this.zip.generateAsync({ type: 'blob' }).then((blob) => {
      this.generatedZip = blob;
    });
    this.generating = false;
    this.generated = true;
    });
  } 
  downloadZip() {
    console.log('clicked');
    if(this.generatedZip) {
      const url = URL.createObjectURL(this.generatedZip);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'files.zip';
      link.click();
    }
    this.hostnames = '';
    this.hostnameList = [];
    this.generated = false;
  }

}
