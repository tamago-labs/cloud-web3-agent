import React from 'react';
import { MapPin, Phone, Mail, Clock, Building2, ArrowRight, Twitter } from 'lucide-react';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Building2 className="w-5 h-5 text-emerald-300" />,
      label: "Company",
      value: "Tamago Blockchain Labs KK"
    },
    {
      icon: <MapPin className="w-5 h-5 text-emerald-300" />,
      label: "Address",
      value: "Co-Working Q, 1-1, JR Hakata City B1F, Hakata, Fukuoka, Japan 812-0012"
    },
    {
      icon: <Clock className="w-5 h-5 text-emerald-300" />,
      label: "Established",
      value: "September 2022"
    },
    {
      icon: <Phone className="w-5 h-5 text-emerald-300" />,
      label: "Phone",
      value: "(81) 80-4894-2495"
    },
    {
      icon: <Mail className="w-5 h-5 text-emerald-300" />,
      label: "Email",
      value: "support@tamagolabs.com"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-teal-900 to-teal-950" id="contact">
      <div className="absolute inset-0  opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-teal-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto mb-4"></div>
          <p className="text-teal-100/80 max-w-2xl mx-auto text-sm md:text-base ">
            Founded in 2022 as a Web3 software house specializing in developing applications on emerging blockchains and have achieved notable recognition and awards
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          {/* Contact card */}
          <div className="w-full max-w-3xl mx-auto bg-teal-800/30 backdrop-blur-sm rounded-2xl p-8 border border-teal-700/30 shadow-xl">
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="p-3 bg-teal-900/70 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-teal-300 font-medium">{item.label}</h3>
                    <p className="text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          {/* <div className="lg:w-2/5 bg-teal-800/30 backdrop-blur-sm rounded-2xl p-8 border border-teal-700/30 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6">Send us a message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-teal-300 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-teal-900/70 border border-teal-700/50 rounded-lg text-white placeholder-teal-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-teal-300 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 bg-teal-900/70 border border-teal-700/50 rounded-lg text-white placeholder-teal-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-teal-300 text-sm font-medium mb-2">Message</label>
                <textarea
                  className="w-full p-3 bg-teal-900/70 border border-teal-700/50 rounded-lg text-white placeholder-teal-500 min-h-[120px]"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-lg font-medium text-white transition-all flex items-center justify-center">
                Send Message
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </form>
          </div> */}
        </div>

        <div className="mt-16 text-center">
          <p className="text-teal-400">Connect with us on Twitter/X</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="https://x.com/Tamago_Labs" target="_blank" className="w-10 h-10 bg-teal-900/70 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
              <Twitter className="text-teal-300" />
            </a>
            {/* <div className="w-10 h-10 bg-teal-900/70 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
              <span className="text-teal-300">LI</span>
            </div>
            <div className="w-10 h-10 bg-teal-900/70 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
              <span className="text-teal-300">DC</span>
            </div>
            <div className="w-10 h-10 bg-teal-900/70 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
              <span className="text-teal-300">TG</span>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;