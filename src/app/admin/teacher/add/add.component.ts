import { Component, ElementRef, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TeacherService } from '../teacher.service';
import * as $ from 'jquery';
import { EmojiScriptServiceService } from '../emoji-script-service.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public model = {
    fullname: '',
    profile: '',
    profession: '',
    history: '',
    career_highlight: '',
    key_point: '',
    performance: '',
    address: '',
    emojis:[]
  }
  imageSrc: any;
  showLoader:boolean=false;
  addscript : boolean = false;
  emojiList:any;
  BASEURL:any;

  public Editor = ClassicEditor;
  constructor(private elementRef:ElementRef , private emojiScript: EmojiScriptServiceService , private toastr: ToastrService, private teacherService: TeacherService, private router: Router) {
    this.BASEURL = environment.BASEURL;
   }

  ngOnInit(): void {
    this.getEmojiList();
    $(".form-emoji-div").keydown(function(event) { 
      return false;
    });
  }

  ngAfterViewInit() {
    // assume dynamic HTML was added before
    this.elementRef.nativeElement.querySelector('span').addEventListener('click', this.removeEmoji.bind(this));
  }
 
  openEmoji() {
    console.log('inn')
    if( $('.select_group').css('display') == 'block' ) {
      $('.select_group').css({'display':'none'})
   } else {
    $('.select_group').css({'display':'block'})
   }
   
  }

  getEmojiUrl(id:any){
    $('#emoji_'+id).attr('href');
    console.log($('#emoji_'+id + '> img').attr('src'));
    var emoji = $('#emoji_'+id + '> img').attr('src');
    this.model.emojis.push(emoji);
    var image = new Image();
    image.width = 25;
    image.id = 'img_'+id;
    image.src = emoji;
    var g = document.createElement('div');
    g.setAttribute("id", "div"+id);
    g.setAttribute("class", "artist-collection-photo");
    var button = document.createElement('span');
    button.setAttribute("class", "close")
    button.innerHTML = "X"
    button.addEventListener('click', (e) => {
      this.removeEmoji(id);
     });
    g.appendChild(button)
    g.appendChild(image)
    document.getElementById('emoji-area').appendChild(g);
    
  }
  
 

  public removeEmoji(id)
  {
    var removeSrc = $('#img_'+id).attr('src');
    var totalArray = this.model.emojis;
    var index = totalArray.indexOf(removeSrc);
    if (index > -1) {
      totalArray.splice(index, 1);
    }
    $('#img_'+id).parent().remove();
 
  }

  getEmojiList(){
    this.teacherService.getEmojiList(1).subscribe(result => {
      if (result.success) {
        this.emojiList = result.data;
      } else {
        this.toastr.error(result.message)
      }
    },
      error => {

      }
    )
  }

  teacherSubmit(f: NgForm) {

    if (f.valid && this.model.profile && this.model.emojis.length != 0 ) {
      this.showLoader = true;
      const formData = new FormData();
      formData.append('profile', this.model.profile);
      formData.append('fullname', this.model.fullname);
      formData.append('profession', this.model.profession);
      formData.append('history', this.model.history);
      formData.append('career_highlight', this.model.career_highlight);
      formData.append('key_point', this.model.key_point);
      formData.append('performance', this.model.performance);
      formData.append('address', this.model.address);
      formData.append('emojis[]', JSON.stringify(this.model.emojis));

      this.teacherService.addTeacher(formData).subscribe(result => {
        if (result.success) {
          this.showLoader = false;
          this.toastr.success(result.message);
          // this.router.navigateByUrl('/admin/artist/list')
          window.location.href = this.BASEURL+"/admin/artist/list";
        } else {
          this.toastr.error(result.message)
        }
      },
        error => {

        }
      )
    }

  }

  handleClick(e){
    console.log(e)
  }
  onFileChange(event) {

    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.model.profile = file;
    }
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };

    }
  }

}
