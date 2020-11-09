import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-module',
  templateUrl: './delete-module.component.html',
  styleUrls: ['./delete-module.component.scss']
})
export class DeleteModuleComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

ngOnInit() {
}

onCancelClick() {
this.dialogRef.close({ data: false });
}

onDeleteClick() {
this.dialogRef.close({ data: true });
}

}
