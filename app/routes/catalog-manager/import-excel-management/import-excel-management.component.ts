import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import { FileManagerService } from 'src/app/services/file-manager/file-manager.service';
import { ToastService } from '@shared';

@Component({
  selector: 'app-import-excel-management',
  templateUrl: './import-excel-management.component.html',
  styleUrls: ['./import-excel-management.component.less']
})
export class ImportExcelManagementComponent implements OnInit {
  isBreadcrumb: any = false;
  breadcrumbs: any = [];
  isEdit: any;
  addForm: any;
  listExcelFile: any = [];
  lstNewFile: any = [];
  isSubmit: any = false;
  accept: string = "accept";
  validMaxSize: number = 1;

  constructor(
    private fileManagerService: FileManagerService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.buildForm();
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.setBreadcrumb();
  }

  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.catalog-management'),
        route: '',
      },
      {
        name: this.translateService.instant('breadcrumb.excel-management'),
        route: '/catalog-management/excel',
      },
      {
        name: this.translateService.instant(!this.isEdit ? 'breadcrumb.excel-management.add' : 'breadcrumb.excel-management.edit'),
        route: '',
      },

    ];
    this.isBreadcrumb = true;
  }

  buildForm() {
    this.addForm = this.formBuilder.group({
      id: null,
      fileExcel: new FormControl()
    });
  }

  uploadFileTemp(event: any){
    if(this.isValidFile(event.target.files[0])) {
      this.listExcelFile.push(event.target.files);
      this.lstNewFile.push(this.listExcelFile[0][0]);
      this.listExcelFile.shift();
    }
  }

  handleDeleteFile(item: any, index: any) {
    this.lstNewFile.splice(index, 1);
  }

  submitForm() {
    this.fileManagerService.uploadMultipleFile(this.lstNewFile, 1).subscribe(res => {
      console.log(res);
      if(res.message === "C???p nh???t th??nh c??ng!"){
        this.toastService.openSuccessToast('Import file ????? xu???t th??nh c??ng!');
      } else {
        this.toastService.openErrorToast('Import file ????? xu???t th???t b???i!');
      }
      this.router.navigate(["/catalog-management/offer"]);
    });
  }

  isValidFile(files): boolean {
    if (!files) {
      return true;
    }
    if (this.accept) {
      const fileName = files.name;
      const temp = fileName.split('.');
      const ext = temp[temp.length - 1].toLowerCase();
      const lenghtName = temp[0].length;
      const ruleFile = ',' + this.accept;
      if (lenghtName > 200) {
        this.toastService.openErrorToast('T??n file kh??ng ???????c v?????t qu?? 200 k?? t???.');
        return false;
      }
      if (this.tctGetFileSize(files) > this.validMaxSize) {
        this.toastService.openErrorToast('Ch??? cho ph??p t???i file c?? dung l?????ng t???i ??a 1Mb');
        return false;
      }
    }
    return true;
  }

  tctGetFileSize(files) {
    try {
      let fileSize;
      fileSize = files.size;
      fileSize /= (1024 * 1024); // chuyen ve MB
      return fileSize.toFixed(2);
    } catch (ex) {
      console.error(ex.message);
    }
  }
}
