import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const roles = [
    {
      name: 'Secretary',
      slug: 'secretary',
      icon: '📋',
      description: 'Administrative support and office management',
      isActive: true,
    },
    {
      name: 'Administrative Officer',
      slug: 'admin-officer',
      icon: '👔',
      description: 'Administrative operations and coordination',
      isActive: false,
    },
    {
      name: 'Data Analyst',
      slug: 'data-analyst',
      icon: '📊',
      description: 'Data analysis and reporting',
      isActive: false,
    },
    {
      name: 'HR Manager',
      slug: 'hr-manager',
      icon: '👥',
      description: 'Human resources management',
      isActive: false,
    },
    {
      name: 'Policy Advisor',
      slug: 'policy-advisor',
      icon: '📜',
      description: 'Policy development and analysis',
      isActive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Master AI Tools for
              <span className="block text-amber-600 mt-2">Public Service</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Professional AI training tailored to your role in the public sector. 
              Learn practical skills to enhance productivity and service delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">
                  Start Learning Now
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Platform</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Designed specifically for public sector professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Role-Based Learning</h4>
              <p className="text-slate-600">
                Personalized content tailored to your specific job role and responsibilities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Practical Skills</h4>
              <p className="text-slate-600">
                Learn AI tools you can use immediately in your daily work
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Track Progress</h4>
              <p className="text-slate-600">
                Monitor your learning journey with detailed progress tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Role</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Select your job category to get started with personalized training
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {roles.map((role) => (
              <Card 
                key={role.slug} 
                className={`relative ${
                  role.isActive 
                    ? 'border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer' 
                    : 'opacity-60 bg-slate-50'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{role.icon}</div>
                    {!role.isActive && (
                      <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                        Coming Soon
                      </Badge>
                    )}
                    {role.isActive && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Available
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-slate-900">{role.name}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                {role.isActive && (
                  <CardContent>
                    <Link href="/signup">
                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                        Start Training
                      </Button>
                    </Link>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">AI Training Platform</h2>
            <p className="text-slate-400 mb-8">
              Empowering public servants with AI skills
            </p>
            <p className="text-sm text-slate-500">
              © 2026 AI Training Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
