# README

## Setup

1. Install npm packages -> `yarn install`
2. Run Bundler -> `bundle install`
3. Run the migration -> `rake db:migrate`
4. Run the seeding -> `rake db:seed`

## Run Project

1. In console, run `rails s`
2. In another pane/window, run -> `bin/webpack-dev-server`


## Deploy Project

1. In another window, run `RAILS_ENV=production  bundle exec rake assets:precompile `

## Storybook

To run storybook -> `yarn storybook`

## Chromatic (Publish Storybook)

You can publish a static storybook to Chromatic's CDN by using this command -> `yarn chromatic`
The new storybook can be reviewed by other collaborators on the project.

## Email Previews

`ActionMailer` email previews are to be placed in `spec/mailers/previews`.
Refer to the guides for everything else.
