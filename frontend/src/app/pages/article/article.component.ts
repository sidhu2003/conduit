import { Component } from '@angular/core';
import { Article, ArticleResponse } from "../../common/models/api/article.model";
import { ArticleService } from "../../common/services/api/article.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { ProfileService } from "../../common/services/api/profile.service";
import { constructLoginUrlTree } from "../../common/guards/authentication.guard";
import { finalize, Observable } from "rxjs";
import { ProfileResponse } from "../../common/models/api/profile.model";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {
  public article?: Article;

  private _articleSlug: string
  public isArticleOwner = false;
  public isLoading = true;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _articleService: ArticleService,
    private readonly _authService: AuthenticationService,
    private readonly _profileService: ProfileService,
    private readonly _router: Router
  ) {
    this._articleSlug = this._activatedRoute.snapshot.params['slug'];
    this._loadArticle();
  }

  private _loadArticle(): void {
    this.isLoading = true;
    this._articleService.getArticle(this._articleSlug)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.article = response.article;
        this._checkArticleOwner();
    });
  }

  private _checkArticleOwner(): void {
    this._authService.currentUser$.subscribe(user => {
      this.isArticleOwner = this.article?.author.username === user?.username;
    });
  }

  public delete(): void {
    if (this.article) {
      this._articleService.deleteArticle(this.article.slug).subscribe(() => {
        this._router.navigateByUrl('/');
      });
    }
  }

  public toggleArticleFavorited(favorited: boolean): void {
    if (!this.article) return;

    this._constructToggleArticleFavoriteRequest(favorited).subscribe({
      next: response => {
        this.article = response.article;
      },
      error: () => {
        this._router.navigateByUrl(constructLoginUrlTree(this._router));
      }
    });
  }

  private _constructToggleArticleFavoriteRequest(favorited: boolean): Observable<ArticleResponse> {
    if (favorited) {
      return this._articleService.favoriteArticle(this.article!.slug);
    }

    return this._articleService.unfavoriteArticle(this.article!.slug);
  }

  public toggleAuthorFollowed(followed: boolean): void {
    if (!this.article) return;

    this._constructToggleAuthorFollowRequest(followed).subscribe({
      next: response => {
        this.article!.author = response.profile;
      },
      error: () => {
        this._router.navigateByUrl(constructLoginUrlTree(this._router));
      }
    });
  }

  private _constructToggleAuthorFollowRequest(followed: boolean): Observable<ProfileResponse> {
    if (followed) {
      return this._profileService.followUser(this.article!.author.username);
    }

    return this._profileService.unfollowUser(this.article!.author.username);
  }
}
