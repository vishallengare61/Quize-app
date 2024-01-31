import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-exam-overview',
  templateUrl: './exam-overview.component.html',
  styleUrls: ['./exam-overview.component.css']
})
export class ExamOverviewComponent implements OnInit{

  pathQuestions =[
    {
    id: 0,
    title: 'About Exam',
    content: "<p><u><strong>Brief Introduction</strong></u></p>\n\n<p>The goal of the Academic, Training, Innovation and Research unit of Central Board of Secondary Education is to achieve academic excellence by conceptualising policies and their operational planning to ensure balanced academic activities in the schools affiliated to the Board. The Unit strives to provide Scheme of Studies, curriculum, academic guidelines, textual material, support material, enrichment activities and capacity building programmes. The unit functions according to the broader objectives set in the National Curriculum Framework-2005 and in consonance with various policies and acts passed by the Government of India from time to time.</p>",
    "is_active": true,
  },
    {
    id: 1,
    title: 'Eligibility and age limit',
    content: "<p><strong><u>Percentage of attendance required to appear in the examination</u></strong></p>\n\n<p>Atleast 75% attendance in an academic session and the rest depends on school.</p>\n\n<p><u><strong>Age Limit</strong></u></p>\n\n<p>As per the rules framed by CBSE, to secure admissions into class 1, the minimum age requirement is 5+ years.The admissions will be conducted as per the rules and regulations framed by the state or Union territory governments of the location of the institution.</p>",
    "is_active": true,
  },
    {
    id: 2,
    title: 'paper pattern',
    content: "<p><u><strong>Mode of Exam</strong></u></p>\n\n<p>Offline</p>\n\n<p><strong><u>Medium of Language</u></strong></p>\n\n<p>English/Hindi</p>\n\n<p>&nbsp;</p>",
    "is_active": true,
  },
    {
    id: 3,
    title: 'Exam dates',
    content: "<p>Exam Dates will be&nbsp;decided by School Authorities.</p>",
    "is_active": true,
  },
    {
    id: 4,
    title: 'exam centers and conducting authority',
    content: "<p><u><strong>Exam Centres</strong></u></p>\n\n<p>Your School</p>\n\n<p><u><strong>Exam conducting authority</strong></u></p>\n\n<p>Your School</p>",
    "is_active": true,
  },
    {
    id: 5,
    title: 'syllabus',
    content: "<p><u><strong>Mathematics</strong></u></p>\n\n<ul>\n\t<li>Geometry</li>\n\t<li>Numbers</li>\n\t<li>Money</li>\n\t<li>Measurement</li>\n\t<li>Data Handling</li>\n\t<li>Patterns</li>\n</ul>\n\n<p><u><strong>EVS</strong></u></p>\n\n<ul>\n\t<li>Weather and Seasons</li>\n\t<li>Food and Water</li>\n\t<li>Travel and Safety</li>\n\t<li>Human Body</li>\n\t<li>Plants</li>\n\t<li>Clothes</li>\n\t<li>My Family and School</li>\n\t<li>Family Tree</li>\n</ul>",
    "is_active": true,
  },
    {
    id: 6,
    title: "Official Website",
    content:"<p><strong><a href=\"https://www.cbse.gov.in/\">https://www.cbse.gov.in/</a></strong></p>",
    "is_active": true,
  },
  ] 

  isAuthenticated = true;
  sanitizedContent: SafeHtml | undefined;
  
  constructor(private sanitizer: DomSanitizer){

  }  

  ngOnInit(): void {

  }

}
