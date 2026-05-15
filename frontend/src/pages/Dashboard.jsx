'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const CRMDashboard = () => {
  const ticketsTrendData = [
    { day: 'Mon', created: 45, solved: 38 },
    { day: 'Tue', created: 52, solved: 48 },
    { day: 'Wed', created: 48, solved: 45 },
    { day: 'Thu', created: 65, solved: 60 },
    { day: 'Fri', created: 55, solved: 52 },
    { day: 'Sat', created: 40, solved: 35 },
    { day: 'Sun', created: 42, solved: 40 },
  ];

  const ticketsByTypeData = [
    { name: 'New', value: 45, color: '#22d3ee' },
    { name: 'Open', value: 30, color: '#a855f7' },
    { name: 'Resolved', value: 25, color: '#eab308' },
  ];

  const newVsReturnedData = [
    { name: 'New Tickets', value: 1200, color: '#c026d3' },
    { name: 'Returned Tickets', value: 320, color: '#7c3aed' },
  ];

  const weekDayData = [
    { day: 'Mon', tickets: 45 },
    { day: 'Tue', tickets: 62 },
    { day: 'Wed', tickets: 78 },
    { day: 'Thu', tickets: 55 },
    { day: 'Fri', tickets: 68 },
    { day: 'Sat', tickets: 35 },
    { day: 'Sun', tickets: 42 },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f17] text-white flex font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#16161f] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center text-lg font-bold">
              C
            </div>
            <div>
              <div className="font-semibold text-xl tracking-tight">CRM Dashboard</div>
              <div className="text-xs text-gray-500">v2.4.1</div>
            </div>
          </div>
        </div>

        <div className="px-3">
          <div className="px-3 py-2 text-xs uppercase text-gray-500 font-medium mt-6 mb-2">MENU</div>
          <nav className="space-y-1">
            {['Inbox', 'Campaigns', 'Analytics', 'Reports', 'Team'].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-colors ${
                  item === 'Inbox' ? 'bg-purple-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        <div className="px-3 mt-8">
          <div className="px-3 py-2 text-xs uppercase text-gray-500 font-medium mb-2">TICKET STATUS</div>
          <div className="space-y-1 px-3">
            {['Open', 'In Progress', 'Resolved', 'Closed', 'On Hold'].map((status, i) => (
              <div key={i} className="flex items-center justify-between py-2 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      i === 0
                        ? 'bg-cyan-400'
                        : i === 1
                        ? 'bg-yellow-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  {status}
                </div>
                <span className="text-gray-400 text-xs">
                  {[12, 8, 24, 19, 5][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4">
          <div className="bg-gray-900/50 rounded-2xl p-4 text-xs">
            <div className="text-purple-400 font-medium">Total Tickets</div>
            <div className="text-3xl font-bold mt-1">248</div>
            <div className="text-emerald-400 text-xs mt-1">↑ 14% this week</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Good morning, Alex 👋</h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening with your support tickets today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-900 rounded-full px-4 py-2 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              All Systems Operational
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 transition-colors px-5 py-2.5 rounded-2xl text-sm font-medium">
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-6">
            <div className="text-sm opacity-90">Avg First Reply Time</div>
            <div className="flex items-baseline mt-4 gap-3">
              <div className="text-5xl font-semibold">30</div>
              <div className="text-3xl text-purple-200">15</div>
            </div>
            <div className="text-xs text-purple-200 mt-1">minutes • seconds</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-teal-400 rounded-3xl p-6">
            <div className="text-sm opacity-90">Avg Full Resolve Time</div>
            <div className="flex items-baseline mt-4 gap-3">
              <div className="text-5xl font-semibold">22</div>
              <div className="text-3xl text-cyan-100">40</div>
            </div>
            <div className="text-xs text-cyan-100 mt-1">hours • minutes</div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-6 flex flex-col">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-400">Messages</div>
                <div className="text-4xl font-semibold mt-2">285</div>
              </div>
              <div className="text-emerald-400 text-xs bg-emerald-900/50 px-3 py-1 rounded-2xl h-fit">+12%</div>
            </div>
            <div className="mt-auto text-xs text-gray-400">Today</div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-6 flex flex-col">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-400">Emails</div>
                <div className="text-4xl font-semibold mt-2">142</div>
              </div>
              <div className="text-amber-400 text-xs bg-amber-900/50 px-3 py-1 rounded-2xl h-fit">-3%</div>
            </div>
            <div className="mt-auto text-xs text-gray-400">Today</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Line Chart */}
          <div className="col-span-8 bg-[#16161f] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-semibold">Tickets Created vs Tickets Solved</div>
                <div className="text-xs text-gray-400">Last 7 days</div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-cyan-400" /> Created
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-purple-400" /> Solved
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ticketsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis dataKey="day" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip />
                <Line
                  type="natural"
                  dataKey="created"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
                <Line
                  type="natural"
                  dataKey="solved"
                  stroke="#c026d3"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* First Reply & Resolve Trend */}
          <div className="col-span-4 bg-[#16161f] rounded-3xl p-6">
            <div className="font-semibold mb-4">First Reply and Full Resolve Time</div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ticketsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis dataKey="day" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="#22d3ee"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tickets By Type */}
          <div className="col-span-5 bg-[#16161f] rounded-3xl p-6">
            <div className="font-semibold mb-4">Tickets By Type</div>
            <div className="flex justify-center">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={ticketsByTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {ticketsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {ticketsByTypeData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* New vs Returned Tickets */}
          <div className="col-span-7 bg-[#16161f] rounded-3xl p-6">
            <div className="font-semibold mb-4">New Tickets vs Returned Tickets</div>
            <div className="flex items-center justify-center gap-12">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={newVsReturnedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    dataKey="value"
                  >
                    {newVsReturnedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-6">
                {newVsReturnedData.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tickets by Week Day */}
          <div className="col-span-12 bg-[#16161f] rounded-3xl p-6">
            <div className="font-semibold mb-4">Number of Tickets / Week Day</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weekDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis dataKey="day" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip />
                <Bar dataKey="tickets" fill="#22d3ee" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;