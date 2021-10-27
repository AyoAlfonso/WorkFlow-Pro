module HasFiscalYear
  extend ActiveSupport::Concern

  #this module assumes you have timezone accessible, whther through an includes or the field implemented as a passthrough

  included do
    validates :fiscal_year_start, presence: true
  end

  def current_fiscal_week
    calculate_current_fiscal_week
  end

  def current_fiscal_quarter
    calculate_current_fiscal_quarter
  end

  def current_fiscal_year
    current_time = self.convert_to_their_timezone
    #if the year start is the first of january it means the year end will be this calendar year
    (current_time >= current_year_fiscal_year_start && current_year_fiscal_year_start != Date.parse("#{current_time.year}-01-01")) ? current_time.year + 1 : current_time.year
  end

  def current_fiscal_start_date
    current_time = self.convert_to_their_timezone
    current_time <= current_year_fiscal_year_start ? current_year_fiscal_year_start - 1.year : current_year_fiscal_year_start
  end

  def current_quarter_start_date
    case self.current_fiscal_quarter
    when 1
      current_fiscal_start_date
    when 2
      self.second_quarter_start_date
    when 3
      self.third_quarter_start_date
    else
      self.fourth_quarter_start_date
    end
  end

  def next_quarter_start_date
    case self.current_fiscal_quarter
    when 1
      self.second_quarter_start_date
    when 2
      self.third_quarter_start_date
    when 3
      self.fourth_quarter_start_date
    else
      current_time = self.convert_to_their_timezone
      (current_time < self.current_fiscal_start_date &&
       current_fiscal_start_date != Date.parse("#{current_time.year}-01-01")) ?
        current_fiscal_start_date :
        current_fiscal_start_date + 1.year
    end
  end

  def current_year_fiscal_year_start
    current_year = self.convert_to_their_timezone.year
    fiscal_year_date_for_start_on(current_year)
  end

  def fiscal_year_date_for_start_on(year)
    fiscal_start_month = self.fiscal_year_start.month
    fiscal_start_day = self.fiscal_year_start.day
    Date.parse("#{year}-#{fiscal_start_month}-#{fiscal_start_day}")
  end

  def format_fiscal_year_start
    return "" if fiscal_year_start.blank?
    month = sprintf("%02d", fiscal_year_start.month)
    day = sprintf("%02d", fiscal_year_start.day)
    "#{month}/#{day}"
  end

  def format_month_and_day(date)
    date.strftime("%m/%d").to_date
  end

  def year_for_creating_annual_initiatives
    current_date = self.convert_to_their_timezone
    if current_year_fiscal_year_start > current_date
      within_4_weeks_range(current_year_fiscal_year_start) ? current_year_fiscal_year_start.year : current_date.year
    else
      within_4_weeks_range(current_year_fiscal_year_start + 1.year) ? current_year_fiscal_year_start.year + 1 : current_year_fiscal_year_start.year
    end
  end

  def quarter_for_creating_quarterly_goals
    current_date = format_month_and_day(self.convert_to_their_timezone)
    if current_date.between?(format_month_and_day(current_fiscal_start_date), format_month_and_day(second_quarter_start_date()))
      within_4_weeks_range(second_quarter_start_date()) ? 2 : 1
    elsif current_date.between?(format_month_and_day(second_quarter_start_date()), format_month_and_day(third_quarter_start_date()))
      within_4_weeks_range(third_quarter_start_date()) ? 3 : 2
    elsif current_date.between?(format_month_and_day(third_quarter_start_date()), format_month_and_day(fourth_quarter_start_date()))
      within_4_weeks_range(fourth_quarter_start_date()) ? 4 : 3
    else
      if current_fiscal_start_date > current_date
        current_fiscal_start_date - 4.weeks <= current_date && within_4_weeks_range(self.current_year_fiscal_year_start) ? 1 : 4
      else
        current_fiscal_start_date + 1.year - 4.weeks <= current_date && within_4_weeks_range(self.current_year_fiscal_year_start) ? 1 : 4
      end
    end
  end

  def second_quarter_start_date
    # CHRIS' COMMENT:
    # The reason we do + 13.weeks instead of .next_quarter is because for LynchPyn each quarter
    # is a fixed 13 weeks. Rails does next_quarter by + 3.months (which is not what we want)
    current_fiscal_start_date + 13.weeks
  end

  def third_quarter_start_date
    current_fiscal_start_date + 26.weeks
  end

  def fourth_quarter_start_date
    current_fiscal_start_date + 39.weeks
  end

  def calculate_current_fiscal_week
    current_date = self.convert_to_their_timezone.to_date
   (current_date - current_fiscal_start_date).days.seconds.in_weeks.ceil
  end

  def calculate_current_fiscal_quarter
    current_date = self.convert_to_their_timezone.to_date
    if current_date.between?(current_fiscal_start_date, second_quarter_start_date())
      return 1
    elsif current_date.between?(second_quarter_start_date(), third_quarter_start_date())
      return 2
    elsif current_date.between?(third_quarter_start_date(), fourth_quarter_start_date())
      return 3
    else
      return 4
    end
  end

  def fiscal_year_range
    #can select from initial fiscal year start date to present year + next year
    (fiscal_year_start.year..(self.current_fiscal_year + 1)).to_a.map { |year|
      { year: year, start_date: fiscal_year_date_for_start_on(year) }
    }
  end

  def forum_meetings_year_range
    ((self.current_fiscal_year - 1)..(self.current_fiscal_year + 1)).to_a.map { |year|
      { year: year, start_date: fiscal_year_date_for_start_on(year) }
    }
  end
end
