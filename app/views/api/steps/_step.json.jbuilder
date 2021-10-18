json.extract! step, :id, :step_type, :order_index, :name, :instructions, :duration, :component_to_render, :image_url, :description_text_content
json.link_embed ((step.step_type == "embedded_link" && step.override_key.present?) ? (meeting.team.settings[step.override_key.to_sym] || step.link_embed) : step.link_embed)
