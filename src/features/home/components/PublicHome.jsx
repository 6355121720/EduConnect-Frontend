import { Link } from 'react-router-dom';
import { FiUsers, FiMessageSquare, FiCalendar, FiStar, FiAward, FiCheckCircle } from 'react-icons/fi';

export default function PublicHome() {
  // Fake testimonials from Gujarat universities
  const testimonials = [
    {
      name: "Rahul Patel",
      university: "Dharmsinh Desai University",
      role: "Computer Engineering Student",
      quote: "Found my project team through EduConnect! Connected with 3 talented developers from my city.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      university: "Gujarat University",
      role: "MBA Student",
      quote: "The event feature helped me attend 5+ workshops with industry leaders this semester.",
      rating: 4
    },
    {
      name: "Vikram Joshi",
      university: "Nirma University",
      role: "Mechanical Engineering",
      quote: "Shared my research paper and got valuable feedback from seniors across Gujarat.",
      rating: 5
    }
  ];

  // Partner universities in Gujarat
  const partnerUniversities = [
    "Dharmsinh Desai University",
    "Gujarat University", 
    "Nirma University",
    "PDPU",
    "Ganpat University",
    "Marwadi University"
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="py-24 text-center bg-gradient-to-b from-purple-900/20 to-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6">
            <span className="text-purple-500">Gujarat's</span> Largest Student Network
          </h1>
          <p className="text-gray-300 text-xl mb-10">
            Connect with 50,000+ students across 15+ universities in Gujarat
          </p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/signup" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-medium flex items-center gap-2"
            >
              <FiUsers /> Join Now
            </Link>
            <Link 
              to="/login" 
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: "50K+", label: "Students" },
            { value: "15+", label: "Universities" },
            { value: "200+", label: "Monthly Events" },
            { value: "10K+", label: "Study Groups" }
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-purple-500 text-3xl font-bold">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Why <span className="text-purple-500">Gujarati Students</span> Love Us
        </h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { 
              icon: <FiUsers size={28} />, 
              title: "Local Network", 
              desc: "Find students from your city or university",
              details: [
                "Ahmedabad • Vadodara • Surat",
                "University-specific groups",
                "Regional language support"
              ]
            },
            { 
              icon: <FiMessageSquare size={28} />, 
              title: "Study Together", 
              desc: "Collaborate on projects and assignments",
              details: [
                "Subject-specific channels",
                "File sharing for notes",
                "Exam preparation groups"
              ]
            },
            { 
              icon: <FiCalendar size={28} />, 
              title: "Campus Events", 
              desc: "Discover events across Gujarat",
              details: [
                "Hackathons & Workshops",
                "Cultural festivals",
                "Career fairs"
              ]
            }
          ].map((feature, i) => (
            <div key={i} className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-all">
              <div className="text-purple-500 mb-4">{feature.icon}</div>
              <h3 className="text-white text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.desc}</p>
              <ul className="space-y-2">
                {feature.details.map((item, j) => (
                  <li key={j} className="flex items-start text-gray-300">
                    <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            What <span className="text-purple-500">Our Students</span> Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-gray-700 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <FiStar 
                      key={j} 
                      className={j < testimonial.rating ? "text-yellow-400" : "text-gray-500"} 
                    />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">
                      {testimonial.role}, {testimonial.university}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Partners */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Partnered <span className="text-purple-500">Universities</span> in Gujarat
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partnerUniversities.map((uni, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center justify-center text-center">
              <p className="text-gray-300 font-medium">{uni}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <FiAward className="text-purple-500 text-5xl mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Gujarat's Most Active Student Community
          </h2>
          <p className="text-gray-300 text-xl mb-10">
            Start connecting in less than 2 minutes
          </p>
          <Link 
            to="/signup" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-lg text-lg font-medium inline-flex items-center gap-2"
          >
            <FiUsers /> Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}