module RandomizedColorPickerHelper
  HEX_COLORS = [
    "#022F7B",
    "#005FFE",
    "#71A0F0",
    "#FBB004",
    "#FFCC57",
    "#EFC973",
    "#EC6F25",
    "#EA8C54",
    "#E7A883",
    "#EB221B",
    "#E9524D",
    "#E7827E",
    "#00C3B3",
    "#39CBBF",
    "#71D3CB",
    "#A2D521",
    "#B2D851",
    "#CBE589",
    "#6A56CB",
    "#8879D1",
    "#A59DCC",
    "#C624FF",
    "#CD54F8",
    "#D483F1",
  ]

  def get_randomized_color
    HEX_COLORS.sample
  end
end
