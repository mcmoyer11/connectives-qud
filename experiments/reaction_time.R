#  Stats for Con_Prob
# Date: June 2, 2019
############################
# Stats for Reaction Time Study
############################

setwd("/Users/morganmoyer/Dropbox/Moyer_research/Embedded_Questions/Dissertation/Experiments/Reaction_time/")
# source("helpers.R")

read.pcibex <- function(filepath, auto.colnames=TRUE, fun.col=function(col,cols){cols[cols==col]<-paste(col,"Ibex",sep=".");return(cols)}) {
  n.cols <- max(count.fields(filepath,sep=",",quote=NULL),na.rm=TRUE)
  if (auto.colnames){
    cols <- c()
    con <- file(filepath, "r")
    while ( TRUE ) {
      line <- readLines(con, n = 1, warn=FALSE)
      if ( length(line) == 0) {
        break
      }
      m <- regmatches(line,regexec("^# (\\d+)\\. (.+)\\.$",line))[[1]]
      if (length(m) == 3) {
        index <- as.numeric(m[2])
        value <- m[3]
        if (index < length(cols)){
          cols <- c()
        }
        if (is.function(fun.col)){
          cols <- fun.col(value,cols)
        }
        cols[index] <- value
        if (index == n.cols){
          break
        }
      }
    }
    close(con)
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=cols))
  }
  else{
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=seq(1:n.cols)))
  }
}
r <- read.pcibex("results")

View(r)

require(dplyr)
# results %>%
#   filter(Ending %in% c("No-s","-s") & (Parameter == "Selection" | Value == "Start")) %>%
#   mutate(Accurate = rep(Value[Parameter=="Selection"]==gsub("No-s","two", gsub("-s", "one", Ending[Parameter=="Selection"])), each=2)) %>%
#   group_by(Accurate, Ending, Group, ID) %>%
#   summarise( RT = mean(EventTime[Parameter=="Selection"] - EventTime[Value=="Start"]) , N = length(Value)/2 )

bn = r %>%
  filter((Parameter == "Selection" | Value == "Start") & Type %in% c("test")) %>%
  # mutate(Accurate = rep(Value[Parameter=="Selection"]==gsub("No-s","two", gsub("-s", "one", Ending[Parameter=="Selection"])), each=2)) %>%
  group_by(ID, Group, Verb, SentType, Value) %>%
  summarise( RT = mean(EventTime[Parameter=="Selection"] - EventTime[Value=="Start"]) , N = length(Value)/2 )

View(bn)
