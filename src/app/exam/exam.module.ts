// exam.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SelectBoardComponent } from './select-board/select-board.component';
import { DashboardComponent } from '../home/home/dashboard/dashboard.component';
import { ChoosePComponent } from './choose-p/choose-p.component';
import { ExamOverviewComponent } from './exam-overview/exam-overview.component';
import { ChapterComponent } from './chapter/chapter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { StartExamComponent } from './start-exam/start-exam.component';
import { ReportComponent } from './report/report.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { authGuard } from '../auth.guard';
import { AddQuestionsComponent } from './Admin/add-questions/add-questions.component';
import { AddClassComponent } from './Admin/add-class/add-class.component';
import { AddSubjectsComponent } from './Admin/add-subjects/add-subjects.component';
import { AddSubjectsPartComponent } from './Admin/add-subjects-part/add-subjects-part.component';
import { AddChaptersComponent } from './Admin/add-chapters/add-chapters.component';
import { StudentDetailsComponent } from './Admin/student-details/student-details.component';
import { QuizeReportComponent } from './quize-report/quize-report.component';
import { ExamDetailsComponent } from './exam-details/exam-details.component';
import { MixTestDetailsComponent } from './mix-test-details/mix-test-details.component';


// Define routes for the Exam Module
const routes: Routes = [
  { path: '', component: DashboardComponent,children: [
    { path: 'select-board', component: SelectBoardComponent, canActivate: [authGuard]},
    { path: 'choose-p', component: ChoosePComponent, canActivate: [authGuard]},
    { path: 'exam-overview', component: ExamOverviewComponent, canActivate: [authGuard]},
    { path: 'chapters/:id/:s_name', component: ChapterComponent, canActivate: [authGuard]},
    { path: 'start-Exam/:s_name/:chapter_id/:q_count/:diff_level', component: StartExamComponent, canActivate: [authGuard]},
    { path: 'report', component: ReportComponent, canActivate: [authGuard]},
    { path: 'subjects', component: SubjectsComponent, canActivate: [authGuard]},
    { path: 'add-questions', component: AddQuestionsComponent, canActivate: [authGuard]},
    { path: 'add-class', component: AddClassComponent, canActivate: [authGuard]},
    { path: 'add-subject', component: AddSubjectsComponent, canActivate: [authGuard]},
    { path: 'add-subject-part', component: AddSubjectsPartComponent, canActivate: [authGuard]},
    { path: 'add-chapter', component: AddChaptersComponent, canActivate: [authGuard]},
    { path: 'student-details', component: StudentDetailsComponent, canActivate: [authGuard]},
    { path: 'quize_report/:quizeId', component: QuizeReportComponent, canActivate: [authGuard]},
    { path: 'examDetails/:quizeId', component: ExamDetailsComponent, canActivate: [authGuard]},
    { path: 'mixTestDetails/:test_type', component: MixTestDetailsComponent, canActivate: [authGuard]},
  ]
}, 
{ path: '**', component: PageNotFoundComponent },
  ]
@NgModule({
  declarations: [
   SelectBoardComponent,
   ChoosePComponent,
   ExamOverviewComponent,
   ChapterComponent,
   StartExamComponent,
   ReportComponent,
   SubjectsComponent,
   AddQuestionsComponent,
   AddClassComponent,
   AddSubjectsComponent,
   AddSubjectsPartComponent,
    AddChaptersComponent,
    StudentDetailsComponent,
    QuizeReportComponent,
    ExamDetailsComponent,
    MixTestDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    AppRoutingModule,
    HighchartsChartModule,
  
  ],
})
export class ExamModule {
  constructor(){
    // console.log("ExamModule")
  }
}
