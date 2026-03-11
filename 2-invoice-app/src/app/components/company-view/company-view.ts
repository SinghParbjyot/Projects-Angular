import { Component, Input } from '@angular/core';
import { Company } from '../../models/company';

@Component({
  selector: 'app-company-view',
  standalone : true,
  imports: [],
  templateUrl: './company-view.html',
  
})
export class CompanyView {
  @Input()company : Company = new Company();

}
