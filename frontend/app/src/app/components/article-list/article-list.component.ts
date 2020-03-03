import {
	Component,
	OnInit
} from '@angular/core';
import {
	ApiService
} from './../../service/api.service';
import {
	MatTableDataSource
} from '@angular/material/table';
import {
	ConfirmDialogModel,
	ConfirmDialogComponent
} from '../confirm-dialog/confirm-dialog.component';
import {
	MatDialog
} from '@angular/material/dialog';

@Component({
	selector: '/',
	templateUrl: './article-list.component.html',
	styleUrls: ['./article-list.component.css']
})

export class ArticleListComponent implements OnInit {

	Article: MatTableDataSource < any > ;
	ArticleList: any = [];

	constructor(private apiService: ApiService, public dialog: MatDialog) {
		this.readArticle();
	}

	ngOnInit() {}

	readArticle() {
		this.apiService.getArticles().subscribe((data) => {
			this.ArticleList = data;
			this.Article = new MatTableDataSource < any > (this.ArticleList);
		})
	}

	removeArticle(article, index) {
		const message = `Are you sure you want to do this?`;

		const dialogData = new ConfirmDialogModel("Confirm Action", message);

		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			maxWidth: "400px",
			data: dialogData
		});

		dialogRef.afterClosed().subscribe(dialogResult => {
			if(dialogResult){
				this.apiService.deleteArticle(article._id).subscribe((data) => {
					this.ArticleList.splice(index, 1);
					this.Article = new MatTableDataSource < any > (this.ArticleList);
				});
			}
		});

	}
	selectRow(row) {
		window.open(row.url, '_blank');
	}
	displayedColumns: string[] = ['title', 'created_at', "actions"];

}