import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CatalogManagerRoutingModule} from "./catalog-manager-routing.module";
import {SharedModule} from "@shared";
import {ComponentsModule} from "../components/components.module";
import { ListServerComponent } from './server-management/list-server/list-server.component';
import { DetailServerComponent } from './server-management/detail-server/detail-server.component';
import { ListRequestComponent } from './request-management/list-request/list-request.component';
import { DetailRequestComponent } from './request-management/detail-request/detail-request.component';
import { ImportExcelManagementComponent } from './import-excel-management/import-excel-management.component';
import { OfferManagementComponent } from './offer-management/offer-management.component';
import { ListUserComponent } from './user-management/list-user/list-user.component';
import { DetailUserComponent } from './user-management/detail-user/detail-user.component';
import { ImportExcelRequestManagementComponent } from './import-excel-request-management/import-excel-request-management.component';



@NgModule({
  declarations: [
    ListServerComponent,
    DetailServerComponent,
    ListRequestComponent,
    DetailRequestComponent,
    ImportExcelManagementComponent,
    OfferManagementComponent,
    ListUserComponent,
    DetailUserComponent,
    ImportExcelRequestManagementComponent],
  imports: [
    CommonModule,
    CatalogManagerRoutingModule,
    SharedModule,
    ComponentsModule
  ]
})
export class CatalogManagerModule { }
