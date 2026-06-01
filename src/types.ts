export interface OptimizationRequest {
  originalEmail: string;
  tone: string;
  recipient?: string;
  context?: string;
}

export interface OptimizationResponse {
  subjectLine: string;
  optimizedEmail: string;
  changeSummary: string;
  error?: string;
}

export interface ToneOption {
  id: string;
  name: string;
  description: string;
  bgColor: string;
  textColor: string;
}
