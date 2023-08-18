import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InterfaceDetailsComponent } from './interface-details/interface-details.component';
import { InterfaceFormComponent } from './interface-form/interface-form.component';
import { DeviceFormComponent } from './device-form/device-form.component';
import { ConfigureComponent } from './configure/configure.component';
import { BackupComponent } from './backup/backup.component';

const routes: Routes = [
  { path: 'login', component: AuthenticationComponent},
  { path: '', component: DashboardComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'inventory', component: InventoryComponent},
  { path: 'interface/:interface_info', component: InterfaceDetailsComponent},
  { path: 'add-interface', component: InterfaceFormComponent},
  { path: 'add-device', component: DeviceFormComponent},
  { path: 'configure', component: ConfigureComponent},
  { path: 'backup', component: BackupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
