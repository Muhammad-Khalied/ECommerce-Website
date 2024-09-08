import { Component } from '@angular/core';
import { FlowbiteService } from '../../../shared/services/flowbite.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor( private flowbiteService: FlowbiteService) { }

  ngOnInit(): void {
    
  }

}
