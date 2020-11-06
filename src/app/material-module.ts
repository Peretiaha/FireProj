import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule  } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
    exports: [
        MatInputModule,
        MatOptionModule,
        MatSnackBarModule,
        MatDialogModule,
        MatButtonModule,
        MatSnackBarModule,
        MatTableModule,
        MatDialogModule,
        MatIconModule,
        MatToolbarModule,
        MatMenuModule,
        MatSelectModule,
        MatPaginatorModule
    ]
  })

export class MaterialModule {}