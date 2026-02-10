#!/bin/bash

# AI Success Metrics Dashboard - AWS Deployment Script
# Account: 844416514454 (account-444)
# Region: us-east-1

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_PROFILE="account-444"
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="844416514454"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AI Success Metrics Dashboard - AWS Deployment Script    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print info messages
print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
print_section "Checking Prerequisites"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI not found. Please install it first."
    exit 1
fi
print_success "AWS CLI installed"

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker not found. Please install it first."
    exit 1
fi
print_success "Docker installed"

# Check AWS credentials
if ! aws sts get-caller-identity --profile $AWS_PROFILE &> /dev/null; then
    print_error "AWS credentials not configured for profile: $AWS_PROFILE"
    exit 1
fi
print_success "AWS credentials configured"

# Verify account
ACCOUNT_ID=$(aws sts get-caller-identity --profile $AWS_PROFILE --query Account --output text)
if [ "$ACCOUNT_ID" != "$AWS_ACCOUNT_ID" ]; then
    print_error "Wrong AWS account. Expected: $AWS_ACCOUNT_ID, Got: $ACCOUNT_ID"
    exit 1
fi
print_success "Connected to correct AWS account: $AWS_ACCOUNT_ID"

# Main menu
print_section "Deployment Options"
echo "What would you like to deploy?"
echo ""
echo "1) Frontend only (S3 + CloudFront)"
echo "2) Backend API only (ECS)"
echo "3) AI Agent only (ECS)"
echo "4) Full stack (All components)"
echo "5) Update existing deployment"
echo "6) Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        print_section "Deploying Frontend to S3 + CloudFront"
        
        # Build frontend
        print_info "Building frontend..."
        npm run build
        print_success "Frontend built successfully"
        
        # Create S3 bucket if it doesn't exist
        BUCKET_NAME="ai-dashboard-frontend-prod-$AWS_ACCOUNT_ID"
        if ! aws s3 ls "s3://$BUCKET_NAME" --profile $AWS_PROFILE 2>&1 | grep -q 'NoSuchBucket'; then
            print_info "Creating S3 bucket: $BUCKET_NAME"
            aws s3 mb "s3://$BUCKET_NAME" --region $AWS_REGION --profile $AWS_PROFILE
            print_success "S3 bucket created"
        else
            print_info "S3 bucket already exists: $BUCKET_NAME"
        fi
        
        # Enable static website hosting
        print_info "Configuring static website hosting..."
        aws s3 website "s3://$BUCKET_NAME" \
            --index-document index.html \
            --error-document index.html \
            --profile $AWS_PROFILE
        print_success "Static website hosting configured"
        
        # Upload files
        print_info "Uploading files to S3..."
        aws s3 sync dist/ "s3://$BUCKET_NAME/" \
            --delete \
            --cache-control "public, max-age=31536000" \
            --exclude "index.html" \
            --profile $AWS_PROFILE
        
        aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" \
            --cache-control "no-cache, no-store, must-revalidate" \
            --profile $AWS_PROFILE
        print_success "Files uploaded successfully"
        
        # Get S3 website URL
        S3_URL="http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
        print_success "Frontend deployed!"
        print_info "S3 Website URL: $S3_URL"
        print_warning "Note: For production, set up CloudFront distribution with SSL"
        ;;
        
    2)
        print_section "Deploying Backend API to ECS"
        
        # Create ECR repository if it doesn't exist
        REPO_NAME="ai-dashboard-api"
        if ! aws ecr describe-repositories --repository-names $REPO_NAME --region $AWS_REGION --profile $AWS_PROFILE &> /dev/null; then
            print_info "Creating ECR repository: $REPO_NAME"
            aws ecr create-repository \
                --repository-name $REPO_NAME \
                --region $AWS_REGION \
                --profile $AWS_PROFILE
            print_success "ECR repository created"
        else
            print_info "ECR repository already exists: $REPO_NAME"
        fi
        
        # Build Docker image
        print_info "Building Docker image..."
        cd server
        docker build -t $REPO_NAME .
        print_success "Docker image built"
        
        # Login to ECR
        print_info "Logging in to ECR..."
        aws ecr get-login-password --region $AWS_REGION --profile $AWS_PROFILE | \
            docker login --username AWS --password-stdin \
            $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
        print_success "Logged in to ECR"
        
        # Tag and push image
        print_info "Pushing image to ECR..."
        docker tag $REPO_NAME:latest \
            $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest
        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest
        print_success "Image pushed to ECR"
        
        cd ..
        
        print_success "Backend API deployed!"
        print_info "ECR Image: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest"
        print_warning "Note: You need to create ECS cluster and service manually or use CloudFormation"
        ;;
        
    3)
        print_section "Deploying AI Agent to ECS"
        
        # Create ECR repository if it doesn't exist
        REPO_NAME="ai-dashboard-agent"
        if ! aws ecr describe-repositories --repository-names $REPO_NAME --region $AWS_REGION --profile $AWS_PROFILE &> /dev/null; then
            print_info "Creating ECR repository: $REPO_NAME"
            aws ecr create-repository \
                --repository-name $REPO_NAME \
                --region $AWS_REGION \
                --profile $AWS_PROFILE
            print_success "ECR repository created"
        else
            print_info "ECR repository already exists: $REPO_NAME"
        fi
        
        # Build Docker image
        print_info "Building Docker image..."
        cd WeatherBot
        docker build -t $REPO_NAME .
        print_success "Docker image built"
        
        # Login to ECR
        print_info "Logging in to ECR..."
        aws ecr get-login-password --region $AWS_REGION --profile $AWS_PROFILE | \
            docker login --username AWS --password-stdin \
            $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
        print_success "Logged in to ECR"
        
        # Tag and push image
        print_info "Pushing image to ECR..."
        docker tag $REPO_NAME:latest \
            $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest
        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest
        print_success "Image pushed to ECR"
        
        cd ..
        
        print_success "AI Agent deployed!"
        print_info "ECR Image: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest"
        print_warning "Note: You need to create ECS cluster and service manually or use CloudFormation"
        ;;
        
    4)
        print_section "Deploying Full Stack"
        print_warning "This will deploy all components. This may take 15-20 minutes."
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" != "y" ]; then
            print_info "Deployment cancelled"
            exit 0
        fi
        
        # Deploy frontend
        print_info "Step 1/3: Deploying frontend..."
        $0 <<< "1"
        
        # Deploy backend
        print_info "Step 2/3: Deploying backend..."
        $0 <<< "2"
        
        # Deploy agent
        print_info "Step 3/3: Deploying agent..."
        $0 <<< "3"
        
        print_success "Full stack deployed!"
        print_warning "Note: You still need to configure ECS clusters, services, and load balancers"
        print_info "See AWS_DEPLOYMENT_STEP_BY_STEP.md for complete instructions"
        ;;
        
    5)
        print_section "Updating Existing Deployment"
        echo "What would you like to update?"
        echo ""
        echo "1) Frontend"
        echo "2) Backend API"
        echo "3) AI Agent"
        echo "4) All"
        echo ""
        read -p "Enter your choice (1-4): " update_choice
        
        case $update_choice in
            1)
                print_info "Updating frontend..."
                npm run build
                BUCKET_NAME="ai-dashboard-frontend-prod-$AWS_ACCOUNT_ID"
                aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete --profile $AWS_PROFILE
                print_success "Frontend updated!"
                
                # Invalidate CloudFront cache if distribution exists
                print_info "Looking for CloudFront distribution..."
                DIST_ID=$(aws cloudfront list-distributions --profile $AWS_PROFILE --query "DistributionList.Items[?Origins.Items[?DomainName=='$BUCKET_NAME.s3.$AWS_REGION.amazonaws.com']].Id" --output text)
                if [ -n "$DIST_ID" ]; then
                    print_info "Invalidating CloudFront cache..."
                    aws cloudfront create-invalidation \
                        --distribution-id $DIST_ID \
                        --paths "/*" \
                        --profile $AWS_PROFILE
                    print_success "CloudFront cache invalidated"
                fi
                ;;
            2)
                print_info "Updating backend API..."
                cd server
                docker build -t ai-dashboard-api .
                docker tag ai-dashboard-api:latest \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/ai-dashboard-api:latest
                aws ecr get-login-password --region $AWS_REGION --profile $AWS_PROFILE | \
                    docker login --username AWS --password-stdin \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/ai-dashboard-api:latest
                cd ..
                print_success "Backend API image updated!"
                print_warning "Note: You need to update the ECS service to use the new image"
                ;;
            3)
                print_info "Updating AI Agent..."
                cd WeatherBot
                docker build -t ai-dashboard-agent .
                docker tag ai-dashboard-agent:latest \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/ai-dashboard-agent:latest
                aws ecr get-login-password --region $AWS_REGION --profile $AWS_PROFILE | \
                    docker login --username AWS --password-stdin \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/ai-dashboard-agent:latest
                cd ..
                print_success "AI Agent image updated!"
                print_warning "Note: You need to update the ECS service to use the new image"
                ;;
            4)
                print_info "Updating all components..."
                $0 <<< "5
1"
                $0 <<< "5
2"
                $0 <<< "5
3"
                print_success "All components updated!"
                ;;
        esac
        ;;
        
    6)
        print_info "Exiting..."
        exit 0
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
print_section "Deployment Complete!"
echo ""
print_info "Next steps:"
echo "  1. Review AWS_DEPLOYMENT_STEP_BY_STEP.md for complete setup"
echo "  2. Configure ECS clusters and services (if not done)"
echo "  3. Set up Application Load Balancer"
echo "  4. Configure CloudFront distribution with SSL"
echo "  5. Update DNS records"
echo "  6. Test the deployment"
echo ""
print_success "Happy deploying! 🚀"
