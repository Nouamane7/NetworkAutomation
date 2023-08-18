import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { MatTooltipModule } from '@angular/material/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AuthenticationComponent } from './authentication/authentication.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InventoryComponent } from './inventory/inventory.component';
import { InterfaceDetailsComponent } from './interface-details/interface-details.component';
import { InterfaceFormComponent } from './interface-form/interface-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DeviceFormComponent } from './device-form/device-form.component';
import { ConfigureComponent } from './configure/configure.component';
import { ChartModule } from 'angular-highcharts';
import { BackupComponent } from './backup/backup.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AuthenticationComponent,
    DashboardComponent,
    SearchBarComponent,
    InventoryComponent,
    InterfaceDetailsComponent,
    InterfaceFormComponent,
    DeviceFormComponent,
    ConfigureComponent,
    BackupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    FontAwesomeModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ChartModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
