module HasDefaultAvatarColor
  extend ActiveSupport::Concern
  included do
    after_create :set_default_avatar_color
  end

  POSSIBLE_COLORS = [
    "cautionYellow",
    "warningRed",
    "successGreen",
    "fuschiaBlue",
    "finePine",
    "bali",
    "poppySunrise",
  ]

  def set_default_avatar_color
    self.update(default_avatar_color: POSSIBLE_COLORS.sample)
  end
end
