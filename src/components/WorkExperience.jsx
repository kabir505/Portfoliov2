import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, MapPin, Calendar, Building } from 'lucide-react';

const WorkExperience = ({ Img, Company, Position, Location, Duration, Description, id }) => {
  const handleDetails = (e) => {
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert("Work experience details are not available");
    }
  };

  return (
    <div className="group relative w-full h-full">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-blue-500/20 h-full flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
    
        <div className="relative p-5 z-10 flex flex-col h-full">
          <div className="relative overflow-hidden rounded-lg h-48 mb-4">
            <img
              src={Img}
              alt={`${Company} - ${Position}`}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="space-y-3 flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-blue-400" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200 bg-clip-text text-transparent line-clamp-1">
                {Company}
              </h3>
            </div>
            
            <h4 className="text-xl font-bold text-white line-clamp-2 min-h-[3rem]">
              {Position}
            </h4>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{Location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{Duration}</span>
              </div>
            </div>
            
            <p className="text-gray-300/80 text-sm leading-relaxed line-clamp-2 flex-grow">
              {Description}
            </p>
            
            <div className="pt-4 flex items-center justify-end mt-auto">
              {id ? (
                <Link
                  to={`/work/${id}`}
                  onClick={handleDetails}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <span className="text-sm font-medium">View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-gray-500 text-sm">Details Not Available</span>
              )}
            </div>
          </div>
          
          <div className="absolute inset-0 border border-white/0 group-hover:border-blue-500/50 rounded-xl transition-colors duration-300 -z-50"></div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
