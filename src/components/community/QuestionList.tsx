
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AnswerForm from "./AnswerForm";

interface Answer {
  id: string;
  answer_text: string;
  created_at: string;
  user: {
    name: string;
  };
}

interface Question {
  id: string;
  question_text: string;
  property_interest: string | null;
  created_at: string;
  user: {
    name: string;
  };
  answers: Answer[];
}

interface QuestionListProps {
  userId: string;
  onRefresh: () => void;
}

export default function QuestionList({ userId, onRefresh }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [answeringQuestion, setAnsweringQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('community_questions')
        .select(`
          id,
          question_text,
          property_interest,
          created_at,
          user:community_users(name),
          answers:community_answers(
            id,
            answer_text,
            created_at,
            user:community_users(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswers = (questionId: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleAnswerSuccess = () => {
    setAnsweringQuestion(null);
    fetchQuestions();
    onRefresh();
  };

  if (loading) {
    return <div className="text-center py-8">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No questions yet. Be the first to ask!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Card key={question.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-medium">{question.question_text}</p>
                  <p className="text-sm text-muted-foreground">
                    Posted by {question.user.name} on {format(new Date(question.created_at), 'MMMM d, yyyy')}
                    {question.property_interest && ` • Interest: ${question.property_interest}`}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {answeringQuestion === question.id ? (
                <AnswerForm
                  questionId={question.id}
                  userId={userId}
                  onSuccess={handleAnswerSuccess}
                  onCancel={() => setAnsweringQuestion(null)}
                />
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setAnsweringQuestion(question.id)}
                >
                  Answer This Question
                </Button>
              )}

              {question.answers.length > 0 && (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => toggleAnswers(question.id)}
                    className="flex items-center gap-2"
                  >
                    {expandedQuestions.has(question.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
                  </Button>

                  {expandedQuestions.has(question.id) && (
                    <div className="space-y-4 ml-6 mt-4">
                      {question.answers.map((answer) => (
                        <div key={answer.id} className="border-l-2 border-accent-blue pl-4">
                          <p className="text-sm">{answer.answer_text}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Answered by {answer.user.name} on {format(new Date(answer.created_at), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
