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
        <div>
          <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time insights into model performance and prediction statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Model Status</CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Active</div>
              <p className="text-xs text-muted-foreground mt-1">Ready for predictions</p>
            </CardContent>
          </Card>

          <Card className="glass border-success/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hasData ? `${stats.averageAccuracy.toFixed(1)}%` : 'N/A'}
              </div>
              {hasData && <Progress value={stats.averageAccuracy} className="mt-2" />}
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Predictions Made</CardTitle>
              <CheckCircle className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPredictions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total analyzed</p>
            </CardContent>
          </Card>

          <Card className="glass border-danger/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Fraud Detected</CardTitle>
              <XCircle className="w-4 h-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">{stats.fraudDetected}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {hasData && stats.totalPredictions > 0
                  ? `${Math.round((stats.fraudDetected / stats.totalPredictions) * 100)}% of total`
                  : 'No data yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Prediction History</CardTitle>
              <CardDescription>Last 7 days performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Fake" stroke="#ef4444" fillOpacity={1} fill="url(#colorFake)" />
                  <Area type="monotone" dataKey="Real" stroke="#22c55e" fillOpacity={1} fill="url(#colorReal)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Predictions Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Predictions</CardTitle>
            <CardDescription>Latest job postings analyzed by the system</CardDescription>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <div className="space-y-4">
                {predictions.slice(0, 10).map((pred) => (
                  <div
                    key={pred.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 mb-2 md:mb-0">
                      <h4 className="font-medium">{pred.jobTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(pred.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-medium ${pred.isFake ? 'text-danger' : 'text-success'}`}>
                        {pred.isFake ? 'Suspicious' : 'Legitimate'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {(pred.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto opacity-50 mb-2" />
                <p>No predictions yet</p>
                <p className="text-xs mt-1">Make your first prediction to see analytics</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};