# AWS Permissions Required for Deployment

**Date**: January 25, 2026  
**User**: arn:aws:iam::078801794900:user/faris  
**Account**: 078801794900

---

## ❌ Current Issue

Your AWS user account is missing required permissions to deploy to Elastic Beanstalk. You need your AWS administrator to grant additional permissions.

---

## 🔐 Required IAM Policies

Your AWS administrator needs to attach these managed policies to your user account:

### 1. Elastic Beanstalk Full Access
```
AWSElasticBeanstalkFullAccess
```

### 2. IAM Limited Access (for role management)
```
IAMFullAccess
```
OR create a custom policy with these permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateRole",
                "iam:PutRolePolicy",
                "iam:CreateInstanceProfile",
                "iam:AddRoleToInstanceProfile",
                "iam:PassRole",
                "iam:GetRole",
                "iam:GetInstanceProfile"
            ],
            "Resource": "*"
        }
    ]
}
```

### 3. EC2 Full Access (for key pairs and instances)
```
AmazonEC2FullAccess
```

### 4. Certificate Manager Full Access (for SSL)
```
AWSCertificateManagerFullAccess
```

---

## 🛠️ Required IAM Roles

Your AWS administrator also needs to create these IAM roles if they don't exist:

### Role 1: aws-elasticbeanstalk-service-role

**Trust Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "elasticbeanstalk.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Managed Policies to Attach**:
- `AWSElasticBeanstalkEnhancedHealth`
- `AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy`

### Role 2: aws-elasticbeanstalk-ec2-role

**Trust Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Managed Policies to Attach**:
- `AWSElasticBeanstalkWebTier`
- `AWSElasticBeanstalkWorkerTier`
- `AWSElasticBeanstalkMulticontainerDocker`

**Instance Profile**: Create an instance profile with the same name and attach this role to it.

---

## 📋 Quick Setup Commands for Administrator

Your administrator can run these AWS CLI commands:

### Create Service Role
```bash
# Create service role
aws iam create-role \
  --role-name aws-elasticbeanstalk-service-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "elasticbeanstalk.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach policies
aws iam attach-role-policy \
  --role-name aws-elasticbeanstalk-service-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth

aws iam attach-role-policy \
  --role-name aws-elasticbeanstalk-service-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy
```

### Create EC2 Role
```bash
# Create EC2 role
aws iam create-role \
  --role-name aws-elasticbeanstalk-ec2-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ec2.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach policies
aws iam attach-role-policy \
  --role-name aws-elasticbeanstalk-ec2-role \
  --policy-arn arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier

aws iam attach-role-policy \
  --role-name aws-elasticbeanstalk-ec2-role \
  --policy-arn arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier

aws iam attach-role-policy \
  --role-name aws-elasticbeanstalk-ec2-role \
  --policy-arn arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker

# Create instance profile
aws iam create-instance-profile \
  --instance-profile-name aws-elasticbeanstalk-ec2-role

# Add role to instance profile
aws iam add-role-to-instance-profile \
  --instance-profile-name aws-elasticbeanstalk-ec2-role \
  --role-name aws-elasticbeanstalk-ec2-role
```

### Grant User Permissions
```bash
# Attach policies to user
aws iam attach-user-policy \
  --user-name faris \
  --policy-arn arn:aws:iam::aws:policy/AWSElasticBeanstalkFullAccess

aws iam attach-user-policy \
  --user-name faris \
  --policy-arn arn:aws:iam::aws:policy/IAMFullAccess

aws iam attach-user-policy \
  --user-name faris \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess

aws iam attach-user-policy \
  --user-name faris \
  --policy-arn arn:aws:iam::aws:policy/AWSCertificateManagerFullAccess
```

---

## ✅ Alternative: Use AWS Console

Your administrator can also set this up via AWS Console:

### Step 1: Create IAM Roles
1. Go to **IAM Console** → **Roles** → **Create role**
2. Create `aws-elasticbeanstalk-service-role` (trusted entity: Elastic Beanstalk)
3. Create `aws-elasticbeanstalk-ec2-role` (trusted entity: EC2)
4. Attach the policies listed above

### Step 2: Grant User Permissions
1. Go to **IAM Console** → **Users** → **faris**
2. Click **Add permissions** → **Attach policies directly**
3. Select and attach:
   - AWSElasticBeanstalkFullAccess
   - IAMFullAccess (or custom policy)
   - AmazonEC2FullAccess
   - AWSCertificateManagerFullAccess
4. Click **Add permissions**

---

## 🔄 After Permissions Are Granted

Once your administrator has granted the permissions and created the roles, run:

```bash
cd "/Users/fahaddad/Documents/AI Dashboard"
export PATH="$HOME/Library/Python/3.14/bin:$PATH"

# Create environment
eb create production \
  --instance-type t3.small \
  --single \
  --service-role aws-elasticbeanstalk-service-role \
  --instance_profile aws-elasticbeanstalk-ec2-role
```

---

## 📞 Contact Your AWS Administrator

Send this document to your AWS administrator and ask them to:
1. Create the required IAM roles
2. Grant your user the required permissions
3. Notify you when complete

**Your AWS Account ID**: 078801794900  
**Your IAM User**: faris  
**Your User ARN**: arn:aws:iam::078801794900:user/faris

---

**Status**: ⚠️ WAITING FOR PERMISSIONS  
**Next Step**: Contact AWS administrator  
**Estimated Time**: 15-30 minutes (for administrator)
