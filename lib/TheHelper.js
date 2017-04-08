"use strict"

const COLORS = require('./helpers/ShellColors.js')



class TheHelper {
  static showCreateHelp () {
    console.log("This command allows you to create a book.");
    console.log("Usage: ");
    console.log(COLORS.YELLOW,"$gitbook-setup create [interactive (default) | args | [file file_name]] ",COLORS.RESET_FONT);
    console.log();
    console.log("THREE FORMS FOR CREATION:");
    console.log("- Passing all configuration as arguments");
    console.log(COLORS.BLUE,"$gitbook-setup create args -n [BOOK NAME] -t [[api -p language]| book | faq | own:link] -d [heroku | gh-pages | own:link] -a [AUTHOR\\S] -i [DESCRIPTION]");
    console.log(COLORS.RESET_FONT);
    console.log("Where: ")
    console.log("  -n    ---> The name of the book");
    console.log("  -t    ---> The type of the book. If you indicate api then you have to indicate the programming language.You can use 'own' template and after it will ask you for a link");
    console.log("  -d    ---> Where you want to deploy. You can indicate more at one separating them by commas: -d heroku,gh-pages,own:link.");
    console.log("  -a    ---> Author\\s of the book. Separated by commas. ");
    console.log("  -i    ---> The description of the book");
    console.log(COLORS.RED,"#Examples:");
    console.log(COLORS.GREEN,"$gitbook-setup create args -n MyBook -t api -p C++ -d heroku,own:http://pepsi.cola/ -a 'Casiano Rodriguez Leon, Rudolf Cicko' -i 'beautiful book about c++'");
    console.log(COLORS.GREEN,"$gitbook-setup create args -n MySecondBook -t book  -d gh-pages -a 'Rudolf Cicko' -i 'beautiful book about nothing'");
    console.log(COLORS.RESET_FONT);
    console.log(COLORS.RESET_FONT);
    console.log("- In interactive form (this is the default form when you just call $gitbook-setup create)");
    console.log(COLORS.BLUE,"$gitbook-setup create interactive");
    console.log(COLORS.RESET_FONT, "Or just:")
    console.log(COLORS.BLUE,"$gitbook-setup create ");
    console.log(COLORS.RESET_FONT);
    console.log("- Getting configuration from file (in JSON form)");
    console.log(COLORS.BLUE,"$gitbook-setup create file <file_name>");
    console.log(COLORS.RESET_FONT);
  }

  static showDeployHelp() {
    console.log("deploy help")
  }

  static showGeneralHelp () {
    console.log("Welcome to gitbook-setup. This program allow you to create book easily and also allows you to easily perform a deployment.");
    console.log("USAGE:");
    console.log(COLORS.YELLOW," $gitbook-setup COMMAND [help]", COLORS.RESET_FONT);
    console.log();
    console.log(COLORS.BLUE,"$gitbook-setup create [help]",COLORS.RED,"            --> ", COLORS.GREEN,"Create book. There are three options. [help] give you more detailed information about the command.", COLORS.RESET_FONT);
    console.log(COLORS.BLUE,"$gitbook-setup deploy [help]",COLORS.RED,"            --> ", COLORS.GREEN,"Deploy to somewhere. [help] give you more detailed information about the command.",COLORS.RESET_FONT);
    console.log(COLORS.BLUE,"$gitbook-setup help",COLORS.RED,"                     --> ", COLORS.GREEN,"Show help",COLORS.RESET_FONT);
    console.log(COLORS.BLUE,"$gitbook-setup version | -v",COLORS.RED,"             --> ", COLORS.GREEN,"Show actual version of gitbook-setup",COLORS.RESET_FONT);
    console.log();
  }
}






module.exports = TheHelper;
