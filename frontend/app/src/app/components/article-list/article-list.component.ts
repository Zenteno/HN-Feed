import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: '/',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})

export class ArticleListComponent implements OnInit {
  
  Article: MatTableDataSource<any>;
  ArticleList:any = [];

  constructor(private apiService: ApiService) { 
    this.readArticle();
  }

  ngOnInit() {}

  readArticle(){
    this.apiService.getArticles().subscribe((data) => {
     this.ArticleList = data;
     this.Article = new MatTableDataSource<any>(this.ArticleList);
    })    
  }

  removeArticle(article,index) {
    if(window.confirm('Are you sure?')) {
        this.apiService.deleteArticle(article._id).subscribe((data) => {
          this.ArticleList.splice(index, 1);
          this.Article = new MatTableDataSource<any>(this.ArticleList);
        }
      )    
    }
  }
  selectRow(row) {
    window.open(row.url, '_blank');
  }
  displayedColumns: string[] = ['title', 'created_at',"actions"];
  

}