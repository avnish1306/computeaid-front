import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FlawService } from '../services/flaw.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  showit: string;

  constructor(private route: ActivatedRoute, private flawService: FlawService) { }
  qCode; userId;
  usedBefore: boolean = false;
  preCodes = ["#include <stdio.h>\r\nint main()\r\n{\r\n\tprintf(\"Hello World !!!\");\r\n\treturn 0;\r\n}",
  "#include <iostream>\r\nusing namespace std;\r\nint main()\r\n{\r\n\tcout << \"Hello World !!!\";\r\n\treturn 0;\r\n}",
  "public class solution\r\n{\r\n\tpublic static void main(String[] args)\r\n\t{\r\n\t\tSystem.out.println(\"Hello World !!!\");\r\n\t}\r\n}",
  "print(\"Hello World !!!\")"];
  code: string;  qLang: string = 'c';  result: any; resultMsg: string;
  bootstrapclass: string = 'info';
  codeForm: FormGroup; submitted: boolean=false;
  text="Avnish";  editTheme: string;  editMode: string;

  ngOnInit() {
    this.editTheme = 'eclipse';
    this.editMode = 'c_cpp';
    this.code = this.preCodes[0];
    this.qCode = this.route.snapshot.paramMap.get('qCode');
    this.userId = JSON.parse(localStorage.getItem('user')).name;
    this.codeForm = new FormGroup({
      'qLang': new FormControl(null),
      'code': new FormControl(null),
      'theme': new FormControl(null)
    });
  }

  submit() {
      console.log(this.qLang);
      this.submitted = true;
    let qdata={code: this.code, lang: this.qLang, qCode: this.qCode};
    this.flawService.execute(qdata).subscribe(
      data => { console.log('Success', data);
      this.result = data;
      this.assignClass();
      this.submitted = false;
       },
      error => console.log('Error', error),
    );
    // console.log(this.codeForm.value.code);
    // this._enrollment.evaluate({c: this.code, l: this.qLang}).subscribe(
    //   data => { console.log('Success', data);
    //   this.result = data;
    //   this.assignClass();
    //    },
    //   error => console.log('Error', error),
    // );
  }

  setTheme() {
    this.editTheme = this.codeForm.value.theme;
  }
  
  setMode() {
    if(this.codeForm.value.qLang == 'c') {
      if(!this.usedBefore)
        this.code = this.preCodes[0];
      this.editMode = 'c_cpp';this.qLang = 'c';
      return;
    }
    if(this.codeForm.value.qLang == 'cpp') {
      if(!this.usedBefore)
        this.code = this.preCodes[1];
      this.editMode = 'c_cpp';this.qLang = 'cpp';
      return;
    }
    if(this.codeForm.value.qLang == 'java') {
      if(!this.usedBefore)
        this.code = this.preCodes[2];
      this.editMode = 'java';this.qLang = 'java';
      return;
    }
    if(this.codeForm.value.qLang == 'python') {
      if(!this.usedBefore)
        this.code = this.preCodes[3];
      this.editMode = 'python';this.qLang = 'py';
      return;
    }
  }

  assignClass() {
    if(this.result.eCode == 1) {
      this.bootstrapclass = 'success';
      this.resultMsg = 'Correct Answer';
    }
    if(this.result.eCode == 0) {
      this.bootstrapclass = 'danger';
      this.resultMsg = 'Wrong Answer';
    }
    if(this.result.eCode == 2) {
      this.bootstrapclass = 'warning';
      let errorString = this.result.res.stderr;
      this.resultMsg = 'Compile Time Error:'+errorString;
    }
    if(this.result.eCode == 3) {
      this.bootstrapclass = 'danger';
      this.resultMsg = 'Run Time Error';
    }
    if(this.result.eCode == 4) {
      this.bootstrapclass = 'warning';
      this.resultMsg = 'Time Limit Exceeded';
    }
    this.showit = 'show';
  }

}
