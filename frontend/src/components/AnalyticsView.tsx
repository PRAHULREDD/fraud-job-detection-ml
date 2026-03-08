import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { usePredictionStore } from "@/hooks/usePredictionStore";
import { format, subDays } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AnalyticsView = () => {
  const predictions = usePredictionStore((state) => state.predictions);
  const getStats = usePredictionStore((state) => state.getStats);

  const stats = getStats();
  const hasData = predictions.length > 0;

  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

  const chartData = last7Days.map(day => {
    const dayPredictions = predictions.filter(p => new Date(p.timestamp).toDateString() === day.toDateString());
    return {
      name: format(day, 'MMM d'),
      'Fake': dayPredictions.filter(p => p.isFake).length,
      'Real': dayPredictions.filter(p => !p.isFake).length,
    };
  });

  const confusionMatrixData = {
    'Predicted Fake': { 'Actual Fake': stats.truePositives, 'Actual Real': stats.falsePositives },
    'Predicted Real': { 'Actual Fake': stats.falseNegatives, 'Actual Real': stats.trueNegatives },
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-col items-start justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Activity className="w-3 h-3" />
              <span>Live System Telemetry</span>
            </div>
            <h2 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
              Analytics Dashboard
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Real-time insights into model performance and prediction statistics.
              Powered by advanced ensemble learning and contextual heuristics.
            </p>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          <Card className="relative overflow-hidden glass border-0 bg-background/50 backdrop-blur-xl hover:bg-background/80 transition-all duration-500 group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Model Status</CardTitle>
              <div className="p-2.5 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-500 ring-1 ring-primary/20">
                <Activity className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                Active
              </div>
              <div className="flex items-center mt-3 text-sm text-primary font-medium tracking-wide">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                Ready for predictions
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden glass border-0 bg-background/50 backdrop-blur-xl hover:bg-background/80 transition-all duration-500 group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-success/20 rounded-full blur-3xl group-hover:bg-success/30 transition-colors duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Confidence</CardTitle>
              <div className="p-2.5 bg-success/10 rounded-xl group-hover:scale-110 transition-transform duration-500 ring-1 ring-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                {hasData ? `${stats.averageAccuracy.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="mt-3">
                {hasData ? (
                  <Progress value={stats.averageAccuracy} className="h-1.5 bg-secondary/50" />
                ) : (
                  <p className="text-sm text-muted-foreground">Waiting for data</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden glass border-0 bg-background/50 backdrop-blur-xl hover:bg-background/80 transition-all duration-500 group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-colors duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Scans Run</CardTitle>
              <div className="p-2.5 bg-cyan-400/10 rounded-xl group-hover:scale-110 transition-transform duration-500 ring-1 ring-cyan-400/20">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                {stats.totalPredictions.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-3 font-medium">Total jobs analyzed</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden glass border-0 bg-background/50 backdrop-blur-xl hover:bg-background/80 transition-all duration-500 group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-danger/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-danger/20 rounded-full blur-3xl group-hover:bg-danger/30 transition-colors duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Fraud Caught</CardTitle>
              <div className="p-2.5 bg-danger/10 rounded-xl group-hover:scale-110 transition-transform duration-500 ring-1 ring-danger/20">
                <XCircle className="w-5 h-5 text-danger" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold text-danger group-hover:text-red-400 transition-colors">
                {stats.fraudDetected}
              </div>
              <p className="text-sm text-danger/80 mt-3 font-medium">
                {hasData && stats.totalPredictions > 0
                  ? `${Math.round((stats.fraudDetected / stats.totalPredictions) * 100)}% of total volume`
                  : 'No data yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 relative z-10">
          <Card className="glass border-0 bg-background/40 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
            <CardHeader className="border-b border-white/5 pb-6">
              <CardTitle className="text-2xl font-bold">Prediction Trajectory</CardTitle>
              <CardDescription className="text-base">7-day rolling performance analysis</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff50" tick={{ fill: '#ffffff80' }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff80' }} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                  <Area type="monotone" dataKey="Fake" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorFake)" />
                  <Area type="monotone" dataKey="Real" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorReal)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Predictions Table */}
        <Card className="glass border-0 bg-background/40 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 relative z-10 mb-12">
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-2xl font-bold">Recent Invocations</CardTitle>
            <CardDescription className="text-base">Latest job postings analyzed by the neural engine</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {hasData ? (
              <div className="space-y-3">
                {predictions.slice(0, 5).map((pred) => (
                  <div
                    key={pred.id}
                    className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-card/40 border border-white/5 rounded-xl hover:bg-card/80 hover:border-white/10 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-1 mb-3 md:mb-0 space-y-1">
                      <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{pred.jobTitle}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/50 mr-2"></span>
                        {format(new Date(pred.timestamp), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 bg-background/50 px-4 py-2 rounded-lg border border-white/5">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</span>
                        <span className={`text-sm font-bold flex items-center ${pred.isFake ? 'text-danger' : 'text-success'}`}>
                          {pred.isFake ? <XCircle className="w-4 h-4 mr-1.5" /> : <CheckCircle className="w-4 h-4 mr-1.5" />}
                          {pred.isFake ? 'Suspicious' : 'Legitimate'}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-white/10"></div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confidence</span>
                        <span className="text-lg font-bold font-mono">
                          {(pred.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Activity className="w-10 h-10 text-primary/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground/80">No Predictions Yet</h3>
                <p className="max-w-sm mx-auto">Run your first job listing through the Predictor engine to populate this dashboard.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};