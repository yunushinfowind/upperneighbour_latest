import { Component, ElementRef, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {


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
  Id: any;
  teacherDetail: any;
  showLoader:boolean=false;
  emojiList:any;


  public Editor = ClassicEditor;
  constructor(private elementRef:ElementRef , private toastr: ToastrService, private teacherService: TeacherService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.Id = params['id'];
    })
    this.getTeacherDetail(this.Id);
    this.getEmojiList();
  }

  ngAfterViewInit() {
    // assume dynamic HTML was added before
    this.elementRef.nativeElement.querySelector('button').addEventListener('click', this.removeEmoji.bind(this));
  }

  openEmoji() {
    console.log('inn')
    if( $('.select_group').css('display') == 'block' ) {
      $('.select_group').css({'display':'none'})
   } else {
    $('.select_group').css({'display':'block'})
   }
   
  }

  getTeacherDetail(id) {
    this.teacherService.teacherDetail(id).subscribe(result => {
      if (result.success) {
        this.teacherDetail = result.data;
        this.model.fullname = result.data.fullname;
        this.model.profession = result.data.teacherProfile.profession;
        this.model.history = result.data.teacherProfile.history;
        this.model.career_highlight = result.data.teacherProfile.career_highlight;
        this.model.key_point = result.data.teacherProfile.key_point;
        this.model.performance = result.data.teacherProfile.performance;
        this.model.address = result.data.teacherProfile.address;
        this.imageSrc = result.data.profile
        var emojiArray = result.data.teacherProfile.userEmojis;
        if(emojiArray.length > 0){
          for (let i=0;i<emojiArray.length;i++){
          var image = new Image();
          image.width = 25;
          image.id = 'img_'+emojiArray[i].id;
          image.src = emojiArray[0].emoji;
          var g = document.createElement('div');
          g.setAttribute("id", "div"+emojiArray[i].id);
          g.setAttribute("class", "artist-collection-photo");
          var button = document.createElement('span');
          button.setAttribute("class", "close")
          button.innerHTML = "X"
          button.addEventListener('click', (e) => {
            this.removeEmoji(emojiArray[i].id);
          });
          // button.setAttribute("onclick", "removeEmoji("+id+")");
          g.appendChild(button)
          g.appendChild(image)
          document.getElementById('emoji-area').appendChild(g);
          this.model.emojis.push(emojiArray[0].emoji)
          }
        }
      }

    })
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
    // button.setAttribute("onclick", "removeEmoji("+id+")");
    g.appendChild(button)
    g.appendChild(image)
    document.getElementById('emoji-area').appendChild(g);
    console.log(this.model.emojis)
  }

  public removeEmoji(id)
  {
    var removeSrc = $('#img_'+id).attr('src');
    console.log(removeSrc)
    var totalArray = this.model.emojis;
    var index = totalArray.indexOf(removeSrc);
    console.log(index)
    if (index > -1) {
      totalArray.splice(index, 1);
    }

    $('#img_'+id).parent().remove();
    console.log("ID:"+id)
    console.log(totalArray)
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

    if (f.valid) {
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
      formData.append('id', this.teacherDetail.id);
      formData.append('emojis[]', JSON.stringify(this.model.emojis));

      this.teacherService.editTeacher(formData).subscribe(result => {
        if (result.success) {
          this.showLoader = false;
          this.toastr.success(result.message);
          this.router.navigateByUrl('/admin/artist/list')
        } else {
          this.toastr.error(result.message)
        }
      },
        error => {

        }
      )
    }

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

