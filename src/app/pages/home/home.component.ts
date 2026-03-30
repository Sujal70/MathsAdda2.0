import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  isScrolled = false;
  mobileMenuOpen = false;
  activeTab = '9';
  typewriterText = '';
  private typewriterInterval: any;
  private phrases = [
    'Mathematics Made Easy',
    'Board Exam Ready',
    'Free YouTube Lessons',
    'NCERT Expert Coaching'
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private isDeleting = false;

  contactForm = {
    name: '',
    studentClass: '',
    phone: '',
    school: '',
    email: '',
    message: ''
  };

  formStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';

  // Announcement Banner
  showAnnouncement = true;
  announcement = {
    text: 'New Batch Starting April 2026! Limited Seats Available.',
    link: '#contact',
    linkText: 'Enroll Now'
  };

  // FAQ
  faqs = [
    {
      question: 'What classes do you teach?',
      answer: 'We provide expert coaching for Class 9th and Class 10th students, focusing on Mathematics with smart board teaching, regular test series, and comprehensive study material.',
      open: false
    },
    {
      question: 'What are the batch timings?',
      answer: 'We have multiple batches available — morning, afternoon, and evening — to suit different school schedules. Contact us on WhatsApp for the latest batch timetable.',
      open: false
    },
    {
      question: 'Do you provide online classes?',
      answer: 'Yes! We offer both offline (classroom) and online classes. Our online classes are conducted live with full interaction, doubt clearing, and recorded sessions for revision.',
      open: false
    },
    {
      question: 'What is the fee structure?',
      answer: 'Our fees are very affordable and competitive. Please contact us via WhatsApp or phone for detailed fee information. We also offer installment options.',
      open: false
    },
    {
      question: 'Do you provide study material?',
      answer: 'Yes, we provide comprehensive study material including printed notes, worksheets, previous year papers, sample papers, and NCERT solutions — all included in the fee.',
      open: false
    },
    {
      question: 'How can I join the classes?',
      answer: 'You can join by filling the enrollment form on our website, contacting us on WhatsApp, or visiting our center directly. We also offer a free demo class before enrollment.',
      open: false
    },
    {
      question: 'Are there regular tests and assessments?',
      answer: 'Absolutely! We conduct weekly tests, monthly assessments, and full mock exams before boards. Detailed performance reports are shared with parents regularly.',
      open: false
    }
  ];

  // ✅ Replace with your actual WhatsApp number (with country code, no + or spaces)
  private whatsappNumber = '918218343930'; 

  // ✅ Replace with your Google Apps Script Web App URL (see setup instructions below)
  private googleSheetUrl = 'YOUR_GOOGLE_SCRIPT_URL';

  stats = [
    { icon: 'fas fa-users', value: '5000+', label: 'Students Taught', bg: 'linear-gradient(135deg, #0d9488, #06b6d4)' },
    { icon: 'fas fa-award', value: '95%+', label: 'Pass Rate', bg: 'linear-gradient(135deg, #f97316, #fb923c)' },
    { icon: 'fab fa-youtube', value: '2K+', label: 'YouTube Subscribers', bg: 'linear-gradient(135deg, #ef4444, #f87171)' },
    { icon: 'fas fa-video', value: '100+', label: 'Video Lessons', bg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }
  ];

  aboutFeatures = [
    { icon: 'fas fa-chalkboard', title: 'Interactive Classes', desc: 'Engaging online & offline sessions' },
    { icon: 'fas fa-file-alt', title: 'Study Material', desc: 'Comprehensive notes & worksheets' },
    { icon: 'fas fa-chart-line', title: 'Regular Tests', desc: 'Weekly tests with detailed analysis' },
    { icon: 'fas fa-headset', title: 'Doubt Support', desc: 'Personal doubt clearing sessions' }
  ];

  subjects9 = [
    {
      name: 'Mathematics', icon: 'fas fa-square-root-alt', color: '#0d9488',
      image: 'assets/mathematics.svg',
      description: 'Master algebra, geometry, and number systems with conceptual clarity.',
      topics: ['Regular Test Series', 'Smart Board Teaching', 'Doubt Clearing Sessions', 'Comprehensive Study Material'],
      duration: '12 Months',
      formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSfdfCkxbWanuX7x5Cr0wmBzljoTUzpQEpXAC8koqA8WRAwgEA/viewform?usp=header'
    }
  ];

  subjects10 = [
    {
      name: 'Mathematics', icon: 'fas fa-square-root-alt', color: '#0d9488',
      image: 'assets/mathematics.svg',
      description: 'Board-focused preparation with real number systems to probability.',
      topics: ['Regular Test Series', 'Smart Board Teaching', 'Doubt Clearing Sessions', 'Comprehensive Study Material'],
      duration: '12 Months',
      formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSf0DORwfZT_56xluqtWSd32eKHL2zrFaM-emFurmh9a-VWNDg/viewform?usp=header'
    }
  ];

  videos = [
    { title: 'Triangles - Complete One Shot Revision', description: 'Class 10 Board Exam Preparation', videoId: 'lawAtFFT_EA' },
    { title: 'Coordinate Geometry - One Shot Revision', description: 'Class 10 Board Exam Preparation', videoId: 'nzAvTogHx5I' },
    { title: 'Surface Areas & Volumes - One Shot', description: 'Class 10 - Crack Board Exam', videoId: 'J2JsKiFRb1Q' },
  ];

  results = [
    { name: 'Priya Sharma', score: '98%', detail: 'Class 10 Board - 2025' },
    { name: 'Rahul Verma', score: '96%', detail: 'Class 10 Board - 2025' },
    { name: 'Ananya Gupta', score: '97%', detail: 'Class 10 Board - 2025' },
    { name: 'Arjun Singh', score: '95%', detail: 'Class 10 Board - 2025' }
  ];

  testimonials = [
    {
      name: 'Sneha Patel', role: 'Class 10 Student', initials: 'SP', color: '#0d9488',
      text: 'Sir ki teaching style ekdum amazing hai! Maths jo mujhe sabse mushkil lagta tha, ab mera favourite subject ban gaya hai. Board mein 95% aaye!'
    },
    {
      name: 'Rajesh Kumar', role: 'Parent', initials: 'RK', color: '#f97316',
      text: 'My son\'s performance improved drastically after joining. The regular tests and personal attention really made a difference. Highly recommended!'
    },
    {
      name: 'Aisha Khan', role: 'Class 9 Student', initials: 'AK', color: '#6366f1',
      text: 'YouTube videos are so helpful for revision! And the classroom teaching goes even deeper. Best decision to join this coaching. Thank you Sir!'
    },
    {
      name: 'Meera Joshi', role: 'Parent', initials: 'MJ', color: '#ec4899',
      text: 'The study material and doubt clearing sessions are excellent. My daughter has become much more confident in Science and Maths. Great teaching!'
    },
    {
      name: 'Vikram Tiwari', role: 'Class 10 Student', initials: 'VT', color: '#10b981',
      text: 'Sir ke padhane ka tarika bahut unique hai. Concepts clear ho jaate hain aur yaad bhi rehte hain. Board exam ke liye best preparation!'
    },
    {
      name: 'Pooja Agarwal', role: 'Class 9 Student', initials: 'PA', color: '#8b5cf6',
      text: 'I used to be scared of Science experiments but Sir makes everything so interesting and easy to understand. My marks improved from 70% to 92%!'
    }
  ];

  googleReviewUrl = 'https://share.google/K2MVHKypsn3x1ZdKM';
  googleOverallRating = 5.0;
  googleTotalReviews = 53;

  googleReviews = [
    {
      name: 'Maya Vati', rating: 5, timeAgo: 'a year ago', initials: 'MV', color: '#4285F4',
      text: 'One of best maths teacher to whom I met. Sir explains every concept clearly and takes tests after completion of chapter. Sir takes extra classes for weak students and makes students practice important questions around 20 times before the exam.'
    },
    {
      name: 'Vansh Sharma', rating: 5, timeAgo: 'a year ago', initials: 'VS', color: '#EA4335',
      text: 'Still miss those tuition evenings there. Never learnt mathematics in that fun way. The environment of the class especially, question me ye karna hai uska sapna kaise aaega.. Just not for saying I could actually ask a question 10 times and sir would explain 10 times. Still one of the best decision of my school life to study there.'
    },
    {
      name: 'Ria Gawri', rating: 5, timeAgo: 'a year ago', initials: 'RG', color: '#FBBC05',
      text: 'I am from Delhi and have been studying here since 2021. The complex concepts are made really easy to understand. I was able to score 95% in Maths in my Class 10 Boards. Highly recommend Guru Classes.'
    },
    {
      name: 'Arohi Sharma', rating: 5, timeAgo: 'a year ago', initials: 'AS', color: '#34A853',
      text: 'The best teacher, most humble, encouraging, motivating, very hardworking... can make you understand maths so easily with tricks and tips. Makes the concept so clear that makes you feel so confident. Felt so blessed to be a student of Guru Classes. Highly suggested!'
    },
    {
      name: 'Archna Chauhan', rating: 5, timeAgo: 'a year ago', initials: 'AC', color: '#4285F4',
      text: 'I had been a student of Guru Classes. It was an experience full of learning and joy. Sir teaches exceptionally well, also maintains the decorum of class and is too supportive. Enrol today, the best coaching in town awaits you.'
    },
    {
      name: 'Kushagra Kapoor', rating: 5, timeAgo: 'a year ago', initials: 'KK', color: '#EA4335',
      text: 'I was very weak in maths even after I practiced a lot and my concepts weren\'t strong enough to solve the problems. After I joined Guru Classes my concepts got strong day by day and also got some extra classes whenever I couldn\'t understand. A very nice environment for study and best books, they also provide practice sheets. Thankyou Sir for improving my concepts and making me a strong math problem solver.'
    }
  ];

  ngOnInit(): void {
    this.startTypewriter();
  }

  ngOnDestroy(): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
    if (window.scrollY > 100) {
      this.showAnnouncement = false;
    }
  }

  startTypewriter(): void {
    this.typewriterInterval = setInterval(() => {
      const currentPhrase = this.phrases[this.phraseIndex];

      if (!this.isDeleting) {
        this.typewriterText = currentPhrase.substring(0, this.charIndex + 1);
        this.charIndex++;
        if (this.charIndex === currentPhrase.length) {
          this.isDeleting = true;
          // Pause before deleting
          clearInterval(this.typewriterInterval);
          setTimeout(() => this.startTypewriter(), 2000);
          return;
        }
      } else {
        this.typewriterText = currentPhrase.substring(0, this.charIndex - 1);
        this.charIndex--;
        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        }
      }
    }, this.isDeleting ? 50 : 100);
  }

  getSubjects() {
    return this.activeTab === '9' ? this.subjects9 : this.subjects10;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit(): void {
    const { name, studentClass, phone, school, email, message } = this.contactForm;

    if (!name || !studentClass || !phone) {
      this.formStatus = 'error';
      setTimeout(() => this.formStatus = 'idle', 3000);
      return;
    }

    this.formStatus = 'sending';

    // 1. Send to Google Sheets
    if (this.googleSheetUrl !== 'YOUR_GOOGLE_SCRIPT_URL') {
      fetch(this.googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          class: studentClass,
          phone,
          email,
          message,
          date: new Date().toLocaleString('en-IN')
        })
      }).catch(() => {});
    }

    // 2. Open WhatsApp with pre-filled message
    const whatsappMsg = `*New Enquiry - Maths Adda*\n\n*Name:* ${name}\n*Class:* ${studentClass}th\n*Phone:* ${phone}\n*School:* ${school || 'N/A'}\n*Email:* ${email || 'N/A'}\n*Message:* ${message || 'N/A'}`;

    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(whatsappUrl, '_blank');

    this.formStatus = 'success';
    this.contactForm = { name: '', studentClass: '', phone: '', school: '', email: '', message: '' };
    setTimeout(() => this.formStatus = 'idle', 5000);
  }
}
