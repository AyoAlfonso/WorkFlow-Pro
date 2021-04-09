module JournalEntryHelper
  def questionnaire_attempt_to_text(qa_rendered_steps)
    qa_rendered_steps.select{|step| step.dig("metadata", "journal_question").present?}
    .map{|step| map_step_to_html(step) }.join("")
  end

  def map_step_to_html(step)
    "<p><b>#{step.dig("metadata", "journal_question")}</b></p>
    <p>#{value_form_step(step)}</p>"
  end

  def value_form_step(step)
    step["id"] == "rating" ? "#{step.dig("value")} / 5" : step.dig("value")
  end
end