import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {InputTextComponent} from "../../../components/inputs/input-text/input-text.component";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {APP_PARAMS_TYPE, COLUMNS, defaultRequestList, SCROLL_TABLE} from "../../../../utils";
import {AppParamsService} from "../../../../services/app-params/app-params.service";
import {ToastService} from "@shared";
import {FileManagerService} from "../../../../services/file-manager/file-manager.service";
import { interval, Subscription } from 'rxjs';
import { RequestService } from 'src/app/services/request-management/request.service';


@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.less']
})
export class ListRequestComponent implements OnInit, AfterViewInit, AfterViewChecked {
  searchForm: any;
  breadcrumbs: any = [];
  isBreadcrumb = false;
  total = 0;
  @ViewChild('codeRef', {static: false}) codeRef: InputTextComponent;
  lstData: any[] = [];
  listVM: any[] = [];
  private refreshPage: Subscription;
  request: any = {
    ...defaultRequestList,
  };
  SCROLL_TABLE = SCROLL_TABLE;
  isVisibleModalDelete: any;
  selectedCode: any;
  selectedName: any;
  selectedId: any;
  timeRefresh: string = "";
  check : boolean = true;
  @Input() isChecked = false;
  @Input() isCheckedAll = false;

  constructor(public translateService: TranslateService,
              injector: Injector,
              private router: Router,
              private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private toastService: ToastService,
              private fileManagerService: FileManagerService,
              private activatedRouter: ActivatedRoute,
              private requestService: RequestService
              ) {
  }

  ngOnInit() {
    this.setBreadcrumb();
    this.buildForm();
    console.log(this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.request : "1");
    this.nzOnSearch(null);
    // this.refreshPage = interval(30000).subscribe(
    //   (val) => { this.refreshListVM() }
    // );
  }

  ngAfterViewInit() {
    this.codeRef.focus();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  setBreadcrumb() {
    this.breadcrumbs = [
      {
        name: this.translateService.instant('breadcrumb.catalog-management'),
        route: '',
      },
      {
        name: this.translateService.instant('breadcrumb.request-management'),
        route: '/catalog-management/request',
      },
    ];
    this.isBreadcrumb = true;
  }

  nzOnSearch(event: any) {
    this.request.page = 0;
    this.request.size = 10;
    this.fetchRequest();
  }

  fetchRequest() {
    this.requestService.search(this.searchForm.value, this.request).subscribe(res => {
      console.log(res);
      this.lstData = res.data.content;
      this.total = res.data.totalElements;
    })
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      code: new FormControl(null),
      title: new FormControl(null),
      nameNvYc: new FormControl(null),
    });
  }

  onCreate() {
    this.router.navigate(['/catalog-management/request/add'])
  }


  changeCurrentPage(currentPage: number) {
    this.request.page = currentPage;
    this.fetchRequest();
  }

  changeItemPerPage(itemPerPage: number) {
    this.request.page = 0;
    this.request.size = itemPerPage;
    this.fetchRequest();
  }

  // onDownloadFile(fileId: any, fileName: any) {
  //   this.fileManagerService.downloadFileById(fileId, fileName);
  // }

  goToEdit(data: any) {
    this.router.navigate(['/catalog-management/request/detail/' + data.code], {state: {page: this.request}});
  }

  openModalDelete(data: any) {
    this.isVisibleModalDelete = true;
    this.selectedCode = data.code;
    this.selectedName = data.title;
    this.selectedId = data.id;
  }

  callBackModalDelete(event: any) {
    this.requestService.delete(this.selectedId).subscribe(res => {
      console.log(res);
      if (res.data != "1") {
        this.toastService.openErrorToast(this.translateService.instant('catalog-management.request.delete.error', {
          code: this.selectedCode,
          srCode: res.data
        }), null);
        this.isVisibleModalDelete = false;
      } else {
        this.toastService.openSuccessToast(this.translateService.instant('catalog-management.request.delete.success'), null);
        this.isVisibleModalDelete = false;
        if (this.lstData.length == 1) {
          this.request.page = this.request.page > 0 ? this.request.page - 1 : 0;
        }
        this.fetchRequest();
      }
    })
  }

  onCancelModalDelete() {
    this.isVisibleModalDelete = false;
  }
}
